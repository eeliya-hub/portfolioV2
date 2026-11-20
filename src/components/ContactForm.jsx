import { useId, useRef, useState } from 'react';

import { profile } from '../data/profile.js';
import Icon from './Icon.jsx';
import { Shamsa } from './Ornament.jsx';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Each field says what is wrong with it in words, or nothing when it is fine.
// One function per field rather than one pass over the lot, because the form
// asks the question one field at a time — as it is left, and as it is fixed.
const FIELDS = [
  {
    name: 'name',
    label: 'Your name',
    type: 'text',
    autoComplete: 'name',
    // Name and email take half the sheet each on a desk: two short fields
    // stacked full width is two lines of mostly empty rule.
    half: true,
    check: (value) => (value.trim() ? null : 'Add your name so I know who I am replying to.'),
  },
  {
    name: 'email',
    label: 'Your email',
    type: 'email',
    autoComplete: 'email',
    half: true,
    check: (value) => {
      if (!value.trim()) return 'Add an email address so I can reply.';
      if (!EMAIL.test(value.trim())) return 'That address is missing something. Check for a typo before sending.';
      return null;
    },
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    autoComplete: 'off',
    check: (value) => (value.trim() ? null : 'A subject line helps me answer properly.'),
  },
  {
    name: 'message',
    label: 'Message',
    multiline: true,
    check: (value) => (value.trim() ? null : 'Write a message. Even a line or two is enough.'),
  },
];

const EMPTY = Object.fromEntries(FIELDS.map((field) => [field.name, '']));

/**
 * The contact form. It posts to Web3Forms with the public access key — there
 * is no backend of Eeliya's own — and reports every outcome in the page.
 *
 * Four ruled lines and one button. It used to carry a row of knots counting
 * the fields that were ready and a keyboard hint beside the send — a picture
 * of the four errors already written under the fields, and a shortcut nobody
 * asked for. Both are gone: a contact form's whole job is to be obvious.
 *
 * It still answers as it is filled in rather than only when it is sent. A
 * field says what is wrong with it once the reader has left it, and stops
 * saying so the moment it is fixed — never while the first letters are still
 * being typed. Sending seals it: the form gives way to a shamsa struck like
 * a seal and the address the reply will go to.
 */
export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState('idle');
  const [failure, setFailure] = useState(null);
  const [sentTo, setSentTo] = useState('');
  const formRef = useRef(null);
  const id = useId();

  const problems = Object.fromEntries(FIELDS.map((field) => [field.name, field.check(values[field.name])]));
  // A field speaks up once it has been left, or once a send has been tried.
  const shown = (name) => (submitted || touched[name] ? problems[name] : null);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (state === 'error') setState('idle');
  };

  const leave = (event) => {
    const { name, value } = event.target;
    // Leaving an empty field you never typed in is not a mistake yet.
    if (value.trim() || touched[name]) setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    const first = FIELDS.find((field) => problems[field.name]);
    if (first) {
      setState('idle');
      // Move after paint: the error node and its aria-describedby have to
      // exist before focus lands, or nothing is announced.
      requestAnimationFrame(() => formRef.current?.querySelector(`[name="${first.name}"]`)?.focus());
      return;
    }

    setState('sending');
    setFailure(null);

    const payload = new FormData();
    payload.append('access_key', profile.web3formsKey);
    payload.append('name', values.name.trim());
    payload.append('email', values.email.trim());
    payload.append('subject', `Portfolio: ${values.subject.trim()}`);
    payload.append('message', values.message.trim());

    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setSentTo(values.email.trim());
        setValues(EMPTY);
        setTouched({});
        setSubmitted(false);
        // The sheet folds before it is sealed. A reader who asked for
        // stillness gets the seal and not the fold.
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (still) {
          setState('sent');
        } else {
          setState('sealing');
          window.setTimeout(() => setState('sent'), 560);
        }
      } else {
        setState('error');
        setFailure('The message did not go through. Try again in a moment, or reach me on LinkedIn instead.');
      }
    } catch {
      setState('error');
      setFailure('That did not send because the connection dropped. Check your network and try again.');
    }
  };

  if (state === 'sent') {
    return (
      <div className="sealed" role="status">
        <Shamsa className="sealed__seal" />
        <p className="sealed__title">Sent.</p>
        <p className="sealed__text">
          I will reply to <span className="sealed__to">{sentTo}</span>.
        </p>
        <button type="button" className="btn" onClick={() => setState('idle')}>
          <Icon name="send" />
          Write another
        </button>
      </div>
    );
  }

  return (
    <form
      className={`form${state === 'sealing' ? ' form--sealing' : ''}`}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      // Nothing to type into once it has started folding.
      inert={state === 'sealing' ? '' : undefined}
    >
      {FIELDS.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const errorId = `${fieldId}-error`;
        const problem = shown(field.name);
        const fine = !problems[field.name] && values[field.name].trim();
        const Control = field.multiline ? 'textarea' : 'input';
        return (
          <div
            className={['field', field.half && 'field--half', problem && 'field--invalid']
              .filter(Boolean)
              .join(' ')}
            key={field.name}
          >
            <Control
              id={fieldId}
              name={field.name}
              type={field.multiline ? undefined : field.type}
              autoComplete={field.autoComplete}
              // A single space, so :placeholder-shown can tell an empty field
              // from a filled one and the label knows when to rise.
              placeholder=" "
              rows={field.multiline ? 4 : undefined}
              value={values[field.name]}
              onChange={update}
              onBlur={leave}
              onKeyDown={
                field.multiline
                  ? (event) => {
                      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault();
                        formRef.current?.requestSubmit();
                      }
                    }
                  : undefined
              }
              required
              aria-required="true"
              aria-invalid={problem ? true : undefined}
              aria-describedby={problem ? errorId : undefined}
            />
            <label className="field__label" htmlFor={fieldId}>
              {field.label}
            </label>
            {fine ? (
              <span className="field__ok" aria-hidden="true">
                <Icon name="check" />
              </span>
            ) : null}
            {problem ? (
              <p className="field__error" id={errorId}>
                <Icon name="alert" />
                {problem}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="form__foot">
        <button
          type="submit"
          className="btn btn--primary form__send"
          disabled={state === 'sending' || state === 'sealing'}
        >
          {state === 'sending' || state === 'sealing' ? (
            <Shamsa className="form__spin" />
          ) : (
            <Icon name="send" />
          )}
          {state === 'sending' || state === 'sealing' ? 'Sending…' : 'Send message'}
        </button>

        <p className="form__status" data-state={state} role="status" aria-live="polite">
          {state === 'error' ? (
            <>
              <Icon name="alert" />
              {failure}
            </>
          ) : null}
        </p>
      </div>

    </form>
  );
}

export default ContactForm;
