export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-03'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skqWYwpPXPobYf0FzgRpLopiDj3CmUkT39HdV40hTH1ewZUWMF1bBKPaze6YpucAK0r12I9zfyAceYzkZv5gfCGU5LOLMQz8vrvr6UvbjvFmU68BBwYTiwiaQYKEiPWrnH3NZpJeKITnmv8OOO97U3UEzfijivbX4iqkZodW8pKrk9jP7NTM",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
