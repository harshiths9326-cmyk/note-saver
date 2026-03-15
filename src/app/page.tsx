import { BookOpen, Search, Youtube, Sparkles } from 'lucide-react'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'

export default function Home() {
  return (
    <AuthGuard>
      <div className="relative isolate">
        {/* Hero Section */}
        <div className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                New: AI YouTube Summarizer is now live. <Link href="/summarizer" className="font-semibold text-blue-600"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Your AI-Powered Productivity Workspace
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Combine note-taking, video summarization, and AI-driven job searching into one seamless experience.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/notes"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Features
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to stay productive
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    < BookOpen className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    Notes Saver
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Securely save and organize your thoughts with our intuitive note-taking interface.</p>
                    <p className="mt-6">
                      <Link href="/notes" className="text-sm font-semibold leading-6 text-blue-600">Learn more <span aria-hidden="true">→</span></Link>
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Youtube className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    YouTube Summarizer
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Save hours by getting instant AI summaries of any YouTube video just from its URL.</p>
                    <p className="mt-6">
                      <Link href="/summarizer" className="text-sm font-semibold leading-6 text-blue-600">Learn more <span aria-hidden="true">→</span></Link>
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Search className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    Job Search AI
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Leverage Firecrawl to find and analyze job listings that match your profile perfectly.</p>
                    <p className="mt-6">
                      <Link href="/jobs" className="text-sm font-semibold leading-6 text-blue-600">Learn more <span aria-hidden="true">→</span></Link>
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
