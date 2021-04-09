const debug = require('debug')('indieweb-express-site:models:utils:makeTweetable')
const twttr = require('twitter-text')

const { md, isContentEmpty, cleanContent, quoteSafely } = require('../../utilities')

// Does the first object contain a property that matches one of the keys in the second array?
const relevantUrl = (resultObject, tweetableIndiewebFields) => { 
  for (const field of tweetableIndiewebFields) {
    if (resultObject.data[field] !== undefined) return {
      fieldValue: resultObject.data[field],
      fieldName: field
    }
  }
}

const addTweetableContent = (resultObject, options = {}) => {
  const tweetableIndiewebFields = ['quote_of', 'bookmark_of']

  let tweetableObj = relevantUrl(resultObject, tweetableIndiewebFields)

  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.twitter_content && !isContentEmpty(resultObject.twitter_content)) {
    // debug('Found resultObject.twitter_content')

    if (resultObject.data && resultObject.data.title) {
      let combinedContentUrlTitle = cleanContent(`${resultObject.twitter_content}\n${quoteSafely(resultObject.data.title)}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
      if (twttr.parseTweet(combinedContentUrlTitle).valid && !combinedContentUrlTitle.includes('](')) {
        // debug('resultObject.twitter_content (with title)', combinedContentUrlTitle)
        resultObject.twitter = {
          markdown: combinedContentUrlTitle,
          html: md.render(combinedContentUrlTitle)
        }
        return resultObject
      }
    }

    let combinedContentUrl = cleanContent(`${resultObject.twitter_content}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
    if (twttr.parseTweet(combinedContentUrl).valid && !combinedContentUrl.includes('](')) {
      // debug('resultObject.twitter_content', combinedContentUrlTitle)
      resultObject.twitter = {
        markdown: combinedContentUrl,
        html: md.render(combinedContentUrl)
      }
      return resultObject
    }
  }

  // If there is a normal content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.content && resultObject.content.markdown && !isContentEmpty(resultObject.content.markdown)) {
    // debug('Found resultObject.content')
    if (resultObject.data && resultObject.data.title) {
      let combinedContentUrlTitle = cleanContent(`${resultObject.content.markdown}\n${quoteSafely(resultObject.data.title)}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
      if (twttr.parseTweet(combinedContentUrlTitle).valid && !combinedContentUrlTitle.includes('](')) {
        // debug('resultObject.content.markdown (with title)', combinedContentUrlTitle)
        resultObject.twitter = {
          markdown: combinedContentUrlTitle,
          html: md.render(combinedContentUrlTitle)
        }
        return resultObject
      }
    }

    let combinedContentUrl = cleanContent(`${resultObject.content.markdown}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
    if (twttr.parseTweet(combinedContentUrl).valid && !combinedContentUrl.includes('](')) {
      // debug('resultObject.content.markdown', combinedContentUrl)
      resultObject.twitter = {
        markdown: combinedContentUrl,
        html: md.render(combinedContentUrl)
      }
      return resultObject
    }
  }
  

  // if there is content that is tweetableObj then link directly to th
  // for each indieweb field
  // debug('Both twitter_content and content are empty')

  // confirm that combinedContentUrl content and indieweb field is tweetableObj
  let markdownContent = ''
  if (tweetableObj) {
    // debug('tweetableObj')

    switch (tweetableObj.fieldName) {
    case 'quote_of':
      markdownContent = 'I found this Tweet interesting.'
      break

    case 'bookmark_of':
      markdownContent = '🔖 ' + resultObject.data.title
      break

    default:
      markdownContent = 'I found this URL interesting.'
      break
    }
  }

  let combinedContentUrl = cleanContent(`${markdownContent}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
  if (twttr.parseTweet(combinedContentUrl).valid) {
    resultObject.twitter = {
      markdown: combinedContentUrl,
      html: md.render(combinedContentUrl)
    }
    return resultObject
  }

  return resultObject
}

module.exports = addTweetableContent
