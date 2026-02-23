import type { Service } from '@/payload-types'
import { Turnstile } from '@marsidev/react-turnstile'
import { CheckIcon, SpinnerIcon } from '@phosphor-icons/react/ssr'
import { useActionState, type CSSProperties } from 'react'
import { BackgroundGradientAnimation } from './BackgroundGradient'
import { withState } from '@astrojs/react/actions'
import { actions } from 'astro:actions'

export default function ContactForm({
  services = [],
}: {
  services: Service[]
}) {
  const [message, formAction, isPending] = useActionState(
    withState(actions.handleSubmit),
    null,
  )

  return (
    <section className="relative isolate flex h-full w-full flex-col space-y-6 p-10 lg:p-20">
      <BackgroundGradientAnimation containerClassName="opacity-50 absolute rounded-2xl shadow-md ring-1 ring-gray-100/20 ring-inset size-full z-[-1]" />
      <h2 className="max-w-2xl text-3xl leading-snug font-medium text-pretty lg:text-5xl">
        Got a project in mind? We've got the skills. Let's team up.
      </h2>
      <p className="font-[450] text-gray-200">
        Tell us more about yourself and what you've got in mind.
      </p>

      {isPending && <SpinnerIcon className="animate-spin" />}

      {message?.data && (
        <div className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-green-500/30 px-6 py-3 text-sm font-medium text-green-200 shadow-xs">
          <CheckIcon className="size-5" />
          {message.data}
        </div>
      )}

      {!isPending && !message && (
        <form
          name="contact-form"
          method="POST"
          className="flex flex-col space-y-6"
          action={formAction}
        >
          <input type="hidden" name="form-name" value="contact-form" />
          <p className="hidden">
            <label>
              Don’t fill this out if you're human:{' '}
              <input name="bot-field" className="hidden" />
            </label>
          </p>
          <div className="input-group">
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <input
              placeholder="Your Name"
              type="text"
              name="name"
              id="name"
              pattern="[A-Za-z ]{3,}"
              required
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              placeholder="you@company.com"
              type="email"
              name="email"
              id="email"
              required
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone" className="input-label">
              Phone Number
            </label>
            <input
              placeholder="Phone Number"
              type="tel"
              name="phone"
              id="phone"
              required
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="message" className="input-label">
              About the project
            </label>
            <textarea
              placeholder="Tell us a little about the project..."
              name="message"
              id="message"
              rows={4}
              required
              className="input resize-none"
              style={{ fieldSizing: 'content' } as CSSProperties}
            />
          </div>
          <div data-spacer className="h-3" />
          {services.length > 0 && (
            <fieldset className="input-group">
              <legend className="input-label mb-4">
                How can we help? (optional)
              </legend>
              <ul className="grid max-w-lg grid-cols-2 gap-y-4">
                {services.map((service) => (
                  <li
                    key={service.title}
                    className="has-checked:sub-svg:opacity-100 flex items-center gap-1 select-none"
                  >
                    <label
                      htmlFor={service.title}
                      className="inline-flex cursor-pointer items-center justify-between gap-3 rounded-lg text-gray-200 hover:text-gray-300"
                    >
                      <div className="size-4 rounded ring-2 ring-white/50">
                        <CheckIcon className="size-4 opacity-0" />
                      </div>
                      {service.title}
                    </label>
                    <input
                      type="checkbox"
                      name="services"
                      id={service.title}
                      value={service.title}
                      className="sr-only"
                    />
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          <Turnstile siteKey="0x4AAAAAACYodefgyiILNWub" />
          <div data-spacer className="h-3" />
          <div>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-lg border border-transparent bg-black/30 px-6 py-3 text-sm font-medium text-white shadow-xs duration-150 hover:bg-black/80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
            >
              Let's Get Started
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
