export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="heading-4 sm:heading-3">Privacy policy</h1>
      <div className="body-3 mt-8 space-y-6 text-text-muted">
        <p>Toolhub does not ask you to create an account and does not collect personal information to give you a tool.</p>
        <p>The PDF tools, calculators and generators run in your browser. Files you open in a PDF tool are read on your device and are not uploaded to our servers.</p>
        <p>The currency converter requests exchange rates from a public rates source, so that request leaves your device. It does not include your files or personal details.</p>
        <p>If you install Toolhub to your home screen, the app files are stored on your device by your browser.</p>
        <p>Questions about this policy can go to Aivynx at aivynx.com.</p>
      </div>
    </main>
  );
}
