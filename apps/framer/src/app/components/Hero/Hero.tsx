import Link from 'next/link';
import { FlipWords } from '../ui/flip-words';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import Image from 'next/image';

const words = [
  'Frame.',
  'Experience.',
  'Story.',
  'Journey.',
  'Advertisement.',
  'Canvas.',
];

const Button = ({
  className,
  children,
  ...props
}: JSX.IntrinsicElements['button']) => {
  return (
    <button
      className="rounded-md sm:w-36 bg-gray-900 py-2 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
      {...props}
    >
      {children}
    </button>
  );
};

export default function Hero({
  openLoginModal,
}: {
  openLoginModal: () => void;
}) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full pb-12 md:pb-24 lg:pb-32 xl:pb-48">
          <div className="m-auto container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="550"
                src="https://placehold.co/1080x1080/88b378/FFFFFF/png"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create your perfect
                    <FlipWords words={words} />
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    {`Welcome to Framer, the ultimate platform for creating and hosting dynamic Farcaster Frames. Whether you're an advertiser looking to engage your audience or an individual with a story to tell, our tools empower you to craft captivating visual narratives.`}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={openLoginModal}>Get Started</Button>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#key-features"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="key-features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Tell Your Story, One Frame at a Time
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  {`Framer provides all the tools you need to create and share
                  engaging stories. From easy-to-use editing tools to powerful
                  publishing features, we've got you covered.`}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src="https://placehold.co/1080x1080/lightblue/FFFFFF/png"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Easy Frame Creation</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Intuitive tools to help you craft your Frames with ease.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Hosted Solutions</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        We handle the hosting, so you can focus on creating.
                        Your frames are securely hosted on our servers, ensuring
                        they are always accessible to your audience.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Analytics Engagement
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Track and analyze how your audience interacts with your
                        frames. Gain valuable insights to optimize your content
                        and enhance engagement.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Seemless Transactions
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {`Link your frames to external sites for seamless transactions. Whether you're accepting payments with Stripe or facilitating crypto transactions, we've got you covered.`}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container m-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Multimedia Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                A Picture is Worth a Thousand Words
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                In a world where visuals speak louder than words, Farcaster
                Frames allow you to tell your story in a compelling and
                memorable way. Each frame is a canvas where your creativity
                knows no bounds.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-first"
                height="310"
                src="https://placehold.co/1080x1080/FA8072/FFFFFF/png"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Fast and Responsive</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Our quick server response times ensure that your
                        audience remains engaged without any lag, providing a
                        seamless experience every time.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Engage and Connect</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Our platform is designed to help you connect with your
                        audience on a deeper level. Use analytics to understand
                        their preferences and tailor your content accordingly.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Collaborate and Innovate
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Teamwork makes the dream work. Collaborate with others
                        to bring your vision to life, making the creation
                        process more dynamic and innovative.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container m-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Have some questions?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Here are some good ones to get you started.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <FAQAccordion />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container m-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Get started with Framer
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up for a free trial and start creating stories today. You
                only need an email.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center space-x-2">
                <Button onClick={openLoginModal}>Get Started</Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing up, you agree to our
                <Link className="underline underline-offset-2" href="#">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Framer. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export function FAQAccordion() {
  const questions = [
    {
      question: 'What is a Farcaster Frame?',
      answer:
        'A Farcaster Frame is a customizable visualization within the Farcaster ecosystem. It can include images, buttons, and other interactive elements to help you tell your story or present information in a unique way.',
    },
    {
      question: 'How does Framer work?',
      answer:
        'Our application allows you to create, edit, and host Farcaster Frames. You can design frames with images and buttons, track engagement with analytics, and collaborate with team members on projects. We also provide hosting and integration with external sites for transactions.',
    },
    {
      question: 'Do you host the frames?',
      answer:
        'Yes, we handle the hosting of your frames on our secure servers, ensuring they are always accessible to your audience without any interruptions.',
    },
    {
      question: 'Do you have team plans?',
      answer:
        'Yes, our platform supports team structures. You can invite multiple members to collaborate on projects, making it easy to build and manage Farcaster Frames together.',
    },
    {
      question: 'What kind of analytics do you provide?',
      answer:
        'We provide detailed analytics to track how your audience interacts with your frames. This includes engagement metrics, interaction data, and insights to help you optimize your content.',
    },
    {
      question: 'Can I link frames to external sites?',
      answer:
        'Yes, you can link your frames to external sites. This allows for seamless transactions such as payments with Stripe or crypto transactions, enhancing the functionality of your frames.',
    },
    {
      question: 'How fast are the server response times?',
      answer:
        'Our servers are optimized for quick response times, ensuring that your audience experiences smooth and uninterrupted interactions with your frames.',
    },
  ];
  return (
    <Accordion type="single" collapsible className="m-auto w-full md:w-[600px]">
      {questions.map((q, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{q.question}</AccordionTrigger>
          <AccordionContent>{q.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
