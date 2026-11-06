export const metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="heading-4 sm:heading-3">Terms of use</h1>
      <div className="body-3 mt-8 space-y-6 text-text-muted">
        <p>Toolhub is provided free of charge and as is. We work to keep every tool accurate, but we cannot guarantee results.</p>
        <p>Calculators such as BMI and SIP give estimates for general information. They are not medical, tax or investment advice. Check important figures before you rely on them.</p>
        <p>You are responsible for the files you process and for having the right to use them.</p>
        <p>We may change or remove tools at any time. Toolhub is built by Aivynx.</p>
      </div>
    </main>
  );
}
