import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="py-4">
      <div className="contact-container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="contact-form p-5 shadow-sm ">
              <h2 className="text-center mb-4">Contact Us</h2>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control custom-input"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control custom-input"
                      rows="5"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
