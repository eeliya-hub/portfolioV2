// Writes a greyscale matte for ONE person in a photograph: the foreground
// instance that covers a given point.
//
// Vision returns every foreground subject separately, which is the whole
// reason this is possible — a crowd scene can keep one person sharp and let
// the rest go soft, rather than the usual all-or-nothing background blur.
//
//   swift scripts/subject-mask.swift <input> <output.png> [--others] <x> <y> […]
//
// With --others the matte is inverted in meaning: it returns every foreground
// instance the points did NOT land on. That is the one to use when the
// background itself should stay sharp and only the other people should go
// soft — a stage set, a banner, a screen behind a speaker.
//
// Each x,y pair is normalised 0–1 from the TOP-LEFT and names a point landing
// on someone to keep. Several pairs keep several people — the near figure in
// a conversation belongs in front with the subject, not behind with the room.

import AppKit
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
let coords = args.dropFirst(3).compactMap(Double.init)
guard args.count >= 5, coords.count >= 2, coords.count % 2 == 0 else {
    FileHandle.standardError.write("usage: subject-mask.swift <input> <output.png> <x> <y> [<x> <y> …]\n".data(using: .utf8)!)
    exit(2)
}
let points = stride(from: 0, to: coords.count, by: 2).map { (coords[$0], coords[$0 + 1]) }

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let source = CIImage(contentsOf: inputURL) else {
    FileHandle.standardError.write("could not read \(inputURL.path)\n".data(using: .utf8)!)
    exit(1)
}

let handler = VNImageRequestHandler(ciImage: source, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([request]) } catch {
    FileHandle.standardError.write("vision failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}
guard let result = request.results?.first else {
    FileHandle.standardError.write("no subject found\n".data(using: .utf8)!)
    exit(1)
}

let context = CIContext()
let W = source.extent.width
let H = source.extent.height
// Core Image counts from the bottom-left; the arguments count from the top.
let probes = points.map { CGPoint(x: $0.0 * W, y: (1.0 - $0.1) * H) }

func maskImage(_ set: IndexSet) throws -> CIImage {
    let buffer = try result.generateScaledMaskForImage(forInstances: set, from: handler)
    let raw = CIImage(cvPixelBuffer: buffer)
    return raw.transformed(by: CGAffineTransform(
        scaleX: W / raw.extent.width, y: H / raw.extent.height))
}

// Score every instance against every probe, so each named point claims the
// instance it actually lands on.
var scores: [Int: [Float]] = [:]
for index in result.allInstances {
    let image = try maskImage(IndexSet(integer: index))
    scores[index] = probes.map { probe in
        var pixel = [Float](repeating: 0, count: 4)
        context.render(image, toBitmap: &pixel, rowBytes: 16,
                       bounds: CGRect(x: probe.x, y: probe.y, width: 1, height: 1),
                       format: .RGBAf, colorSpace: nil)
        return pixel[0]
    }
}

var keep = IndexSet()
for (n, _) in probes.enumerated() {
    var best = -1
    var bestScore: Float = 0.5
    for (index, values) in scores where values[n] > bestScore {
        bestScore = values[n]
        best = index
    }
    guard best >= 0 else {
        FileHandle.standardError.write(
            "point \(n + 1) lands on no instance (of \(result.allInstances.count) found)\n"
                .data(using: .utf8)!)
        exit(1)
    }
    keep.insert(best)
}

let wanted: IndexSet
if args.contains("--others") {
    var others = result.allInstances
    others.subtract(keep)
    guard !others.isEmpty else {
        FileHandle.standardError.write("nothing else in the foreground to soften\n".data(using: .utf8)!)
        exit(1)
    }
    wanted = others
} else {
    wanted = keep
}

let chosen = try maskImage(wanted)
// The matte arrives in one channel. Spread it across RGB and make it opaque,
// so it encodes as an ordinary greyscale PNG that sharp can read.
let filter = CIFilter(name: "CIColorMatrix")!
filter.setValue(chosen, forKey: kCIInputImageKey)
filter.setValue(CIVector(x: 1, y: 0, z: 0, w: 0), forKey: "inputRVector")
filter.setValue(CIVector(x: 1, y: 0, z: 0, w: 0), forKey: "inputGVector")
filter.setValue(CIVector(x: 1, y: 0, z: 0, w: 0), forKey: "inputBVector")
filter.setValue(CIVector(x: 0, y: 0, z: 0, w: 0), forKey: "inputAVector")
filter.setValue(CIVector(x: 0, y: 0, z: 0, w: 1), forKey: "inputBiasVector")

// The bias makes the matrix output defined everywhere, so it has to be cut
// back to the photograph before it can be encoded.
guard
    let out = filter.outputImage?.cropped(to: CGRect(x: 0, y: 0, width: W, height: H)),
    let space = CGColorSpace(name: CGColorSpace.sRGB),
    let data = context.pngRepresentation(of: out, format: .RGBA8, colorSpace: space)
else {
    FileHandle.standardError.write("could not encode PNG\n".data(using: .utf8)!)
    exit(1)
}
try data.write(to: outputURL)
print("matted \(wanted.count) of \(result.allInstances.count) instance(s) \(Array(wanted)) -> \(outputURL.lastPathComponent)")
