"use client";
import fireAlert from "@/lib/alert";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const [shortURL, setShortURL] = React.useState("");
  const keyCaptcha = process.env.NEXT_PUBLIC_KEY_WEB_CAPTCHA || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = inputRef.current?.value;
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (recaptchaValue) {
      fetch("/api/shortUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })
        .then((res) => res.json())
        .then((data) => {
          setShortURL(data.shortUrl);
          fireAlert({
            title: "Success",
            text: "URL shortened",
            icon: "success",
          });
        })
        .catch((err) => console.error(err));
    } else {
      fireAlert({
        title: "Error",
        text: "Please complete the captcha",
        icon: "error",
      });
    }
  };

  const copyUrlToClipboard = (e: React.FormEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`${baseUrl}/${shortURL}`).then(
      () => {
        fireAlert({
          title: "Success",
          text: "URL copied to clipboard",
          icon: "success",
        });
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  const goToUrl = () => {
    window.open(shortURL, "_blank");
  };

  return (
    <div className="p-6 bg-white rounded shadow-lg">
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          name="data"
          placeholder="Paste Your url"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
        />
        <div className="flex justify-center">
          <ReCAPTCHA ref={recaptchaRef} sitekey={keyCaptcha} />
        </div>

        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Shorten
        </button>

        {shortURL && (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={copyUrlToClipboard}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
            >
              Copy URL
            </button>

            <input
              type="text"
              readOnly
              value={`${baseUrl}/${shortURL}` || ""}
              className="flex-1 px-4 py-2 border rounded text-gray-700 bg-gray-100 cursor-not-allowed"
            />

            <button
              onClick={goToUrl}
              className="px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded"
            >
              Go to URL
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
