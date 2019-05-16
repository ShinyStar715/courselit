/**
 * This file provides app wide constants
 */

module.exports = {
  dbURL: process.env.NODE_ENV === 'production' ? 'mongo' : '172.18.0.2',
  dbName: 'app',
  saltRounds: 10, // for bcrypting the plain text passwords
  jwtSecret: process.env.NODE_ENV === 'production' ? 'KLjl2k3j5lk2j' : 'kj23kl4j5kjk',
  jwtExpire: 60 * 60 * 24 * 10,

  // Constants for content types
  text: 'text',
  audio: 'audio',
  video: 'video',
  pdf: 'pdf',
  quiz: 'quiz',

  // Constants for courses privacy settings
  unlisted: 'unlisted',
  open: 'public',
  closed: 'private',

  // Constants for pagination
  mycoursesLimit: 5,
  postsPerPageLimit: 5,
  postDescTruncLimit: 30,
  coursesPerPageLimit: 3
}
