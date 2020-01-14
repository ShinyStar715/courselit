import fetch from 'isomorphic-unfetch'
import {
  URL_EXTENTION_POSTS,
  URL_EXTENTION_COURSES
} from '../config/constants.js'
import TextEditor from '../components/TextEditor/index.js'

export const queryGraphQL = async (url, query, token) => {
  const options = {
    method: 'POST',
    headers: token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }
  let response = await fetch(url, options)
  response = await response.json()

  if (response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message)
  }

  return response.data
}

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const queryGraphQLWithUIEffects = (backend, dispatch, networkAction, token) =>
  async (query) => {
    try {
      dispatch(networkAction(false))
      let response = await queryGraphQL(
        `${backend}/graph`,
        query,
        token)

      return response
    } catch (err) {
      throw err
    } finally {
      dispatch(networkAction(false))
    }
  }

export const formattedLocaleDate = (epochString) =>
  (new Date(Number(epochString))).toLocaleString('en-US')

// export const removeEmptyProperties = (obj, propToExclude) =>
//   Object
//     .keys(obj)
//     .filter(i => i !== propToExclude)
//     .reduce(
//       (acc, item, index) => {
//         if (obj[item] !== '') {
//           acc[item] = obj[item]
//         }
//         return acc
//       }, {})

// Regex copied from: https://stackoverflow.com/a/48675160/942589
export const makeGraphQLQueryStringFromJSObject = obj =>
  JSON.stringify(obj).replace(/"([^(")"]+)":/g, '$1:')

export const formulateMediaUrl =
  (backend, mediaID, generateThumbnailUrl = false) =>
    `${backend}/media/${mediaID}${generateThumbnailUrl ? '?thumb=1' : ''}`

export const formulateCourseUrl = (course, backend = '') =>
  `${backend}/${course.isBlog ? URL_EXTENTION_POSTS : URL_EXTENTION_COURSES}/${course.id}/${course.slug}`

export const getPostDescriptionSnippet = (rawDraftJSContentState) => {
  const firstSentence = TextEditor
    .hydrate(rawDraftJSContentState)
    .getCurrentContent()
    .getPlainText()
    .split('.')[0]

  return firstSentence ? firstSentence + '.' : firstSentence
}

export const getGraphQLQueryFields = (jsObj, fieldsNotPutBetweenQuotes) => {
  let queryString = '{'
  for (let i of Object.keys(jsObj)) {
    if (jsObj[i] !== undefined) {
      queryString += fieldsNotPutBetweenQuotes.includes(i) ?
        `${i}: ${jsObj[i]},` : `${i}: "${jsObj[i]}",`
    }
  }
  queryString += '}'

  return queryString
}

export const getObjectContainingOnlyChangedFields = (baseline, obj) => {
  const result = {}
  for (let i of Object.keys(baseline)) {
    if (baseline[i] !== obj[i]) {
      result[i] = obj[i]
    }
  }
  return result
}
