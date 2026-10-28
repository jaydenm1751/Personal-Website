
import { useState } from "react";
import type { FormEvent } from "react";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function About() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    field: keyof ContactFormState,
  ): (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
    return (event) => {
      const { value } = event.currentTarget;
      setForm((current) => ({
        ...current,
        [field]: value,
      }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    
    setForm(initialForm);
  }

  return (
    <main className="about-page">
      <header className="about-heading">
        <p className="eyebrow">ABOUT</p>
        <h1>A bit more about me.</h1>
        <p className="about-intro">
          Software engineer based in Dallas, Texas, interested in how systems
          work, how ideas become products, and what we can build next.
        </p>
      </header>

      <section className="about-sections">
        <article className="about-section-block">
          <h2>Background</h2>
          <p>
            I enjoy the space where thoughtful engineering meets curiosity:
            designing APIs, learning how distributed systems behave, and
            experimenting with machine learning. I like understanding not
            just how something works, but why it was built that way.
          </p>
        </article>

        <article className="about-section-block">
          <h2>What I'm focused on</h2>
          <p>
            Right now I'm spending most of my time on systems design, deep
            learning, and finding better ways to turn ideas into useful
            software. This site doubles as a notebook for that work.
          </p>
        </article>

        <article className="about-section-block">
          <h2>Beyond the code</h2>
          <p>
            When I'm not building something, I'm usually reading about how
            other people build things, or chasing down a new idea worth
            exploring.
          </p>
        </article>
      </section>

      <section className="contact-form-section" aria-labelledby="contact-form-heading">
        <p className="eyebrow">GET IN TOUCH</p>
        <h2 id="contact-form-heading">Drop me a message.</h2>
        <p className="about-intro">
          Have a thought, a question, or just want to say hi? Send it over.
        </p>

        {submitted ? (
          <div className="form-success" role="status">
            <p>Thanks for reaching out — I'll get back to you soon.</p>
            <button
              type="button"
              className="text-link"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">
                Contact email <span className="form-required">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-phone">Phone </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">
                Message <span className="form-required">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                value={form.message}
                onChange={handleChange("message")}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-dark">
                Send message
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
