// Lifts the subject out of a photograph using Vision's foreground-instance
// mask, and writes a PNG with a real alpha channel.
//
// This is how the hero portrait is cut out. A shape mask approximating the
// edge of a person reads worse than no cut-out at all, so the matte comes from
// the image itself.
//
//   swift scripts/cutout.swift <input> <output.png>

import AppKit
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: cutout.swift <input> <output.png>\n".data(using: .utf8)!)
    exit(2)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let source = CIImage(contentsOf: inputURL) else {
    FileHandle.standardError.write("could not read \(inputURL.path)\n".data(using: .utf8)!)
    exit(1)
}

let handler = VNImageRequestHandler(ciImage: source, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("vision failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}

guard let result = request.results?.first else {
    FileHandle.standardError.write("no subject found in the image\n".data(using: .utf8)!)
    exit(1)
}

// allInstances asks for every detected subject, so a person holding something
// comes out whole rather than clipped at the wrist.
let masked: CVPixelBuffer
do {
    masked = try result.generateMaskedImage(
        ofInstances: result.allInstances,
        from: handler,
        croppedToInstancesExtent: true
    )
} catch {
    FileHandle.standardError.write("masking failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}

let output = CIImage(cvPixelBuffer: masked)
let context = CIContext()

guard
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB),
    let data = context.pngRepresentation(of: output, format: .RGBA8, colorSpace: colorSpace)
else {
    FileHandle.standardError.write("could not encode PNG\n".data(using: .utf8)!)
    exit(1)
}

try data.write(to: outputURL)

let extent = output.extent
print("cut out \(Int(extent.width))x\(Int(extent.height)) -> \(outputURL.path)")
