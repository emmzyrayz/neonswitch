// app/docs/page.tsx
import Section from "./components/section";
import CodeBlock from "./components/codeblock";
import clsx from "clsx";

export default function DocsPage() {
  return (
    <div>
      {/* INTRO */}
      <Section id="intro" title="Introduction">
        <p className="text-gray-300">
          Welcome to the NeonSwitch API. These endpoints allow you to buy VTU,
          generate virtual numbers, and manage your account programmatically.
        </p>
      </Section>

      {/* AUTH */}
      <Section id="auth" title="Authentication">
        <p className="text-gray-300">
          All requests must include your API key in the header:
        </p>

        <CodeBlock
          code={`GET /v1/account

Headers:
  Authorization: Bearer YOUR_API_KEY`}
        />
      </Section>

      {/* VTU API */}
      <Section id="vtu" title="VTU API">
        <p className="text-gray-300">
          Use this endpoint to top up airtime or data instantly.
        </p>

        <CodeBlock
          code={`POST /v1/vtu/topup

Request Body:
{
  "network": "mtn",
  "phone": "08123456789",
  "amount": 100
}`}
        />
      </Section>

      {/* VIRTUAL NUMBER API */}
      <Section id="virtual-number" title="Virtual Number API">
        <p className={clsx('text-gray-300', 'mb-4')}>
          Generate a temporary or long-term virtual number for verification.
        </p>

        <CodeBlock
          code={`POST /v1/virtual-number/create

Request Body:
{
  "country": "us",
  "service": "tiktok"
}`}
        />
      </Section>

      {/* ERRORS */}
      <Section id="errors" title="Error Codes">
        <CodeBlock
          code={`400 - Invalid Request
401 - Invalid API Key
404 - Resource Not Found
429 - Rate Limit Exceeded
500 - Server Error`}
        />
      </Section>
    </div>
  );
}
