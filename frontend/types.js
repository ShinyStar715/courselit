/**
 * This file contains all the PropTypes used across the app.
 */
import PropTypes from 'prop-types'

export const authProps = PropTypes.shape({
  guest: PropTypes.bool,
  token: PropTypes.string
})

export const profileProps = PropTypes.shape({
  isCreator: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  fetched: PropTypes.bool
})

export const latestPostsProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  creatorName: PropTypes.string.isRequired,
  updated: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired
})

export const siteInfoProps = PropTypes.shape({
  title: PropTypes.string,
  subtitle: PropTypes.string,
  logopath: PropTypes.string,
  currencyUnit: PropTypes.string
})

export const publicCourse = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  creatorName: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  isFeatured: PropTypes.bool.isRequired,
  cost: PropTypes.number.isRequired
})

export const creatorCourse = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  creatorName: PropTypes.string,
  updated: PropTypes.string,
  slug: PropTypes.string,
  isFeatured: PropTypes.bool,
  cost: PropTypes.number
})

export const siteUser = PropTypes.shape({
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  verified: PropTypes.bool.isRequired,
  isCreator: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  avatar: PropTypes.string,
  purchases: PropTypes.arrayOf(PropTypes.object)
})

export const featuredCourse = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  featuredImage: PropTypes.string
})
