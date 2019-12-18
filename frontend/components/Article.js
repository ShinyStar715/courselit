import { Typography, Grid, Button } from "@material-ui/core"  
import Link from "next/link"
import TextEditor from "./TextEditor"
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/styles"
import { BACKEND } from "../config/constants"
import { formulateMediaUrl, formattedLocaleDate } from "../lib/utils"
import { publicCourse } from "../types"
import { BUTTON_START_NOW, BUTTON_TEXT_BUY_NOW } from "../config/strings"
import PriceTag from "./PriceTag"
import BuyButton from "./BuyButton"

const useStyles = (featuredImage) => makeStyles({
  creatoravatarcontainer: {
    display: 'flex',
    alignItems: 'center'
  },
  creatorcard: {
    paddingTop: '0.8em',
  },
  creatoravatar: {
    borderRadius: '1.5em',
    width: '3em',
    marginRight: '1em'
  },
  featuredimagecontainer: {
    marginTop: '2.4em',
    width: '100%',
    height: 240,
    overflow: 'hidden',
    marginBottom: '1.8em',
    background: `url('${formulateMediaUrl(BACKEND, featuredImage)}') no-repeat center center`,
    backgroundSize: 'cover'
  }
})

const Article = (props) => {
  const { course, options } = props
  console.log(course, options)
  const classes = useStyles(course.featuredImage)()
  let courseDescriptionHydrated
  try {
    courseDescriptionHydrated = TextEditor.hydrate(course.description)
  } catch (err) {
    // do nothing
  }

  const handleBuyNow = (course) => {

  }

  return (
    <article className={classes.article}>
      <Typography variant="h2">
        {course.title}
      </Typography>
      {options.showAttribution && 
        <Grid container className={classes.creatorcard}>
          <Grid item className={classes.creatoravatarcontainer}>
              <img src='/static/logo.jpg' className={classes.creatoravatar}></img>
          </Grid>
          <Grid item>
            <Typography variant='overline' component='p'>
            <Link href='/creator/[id]' as={`/creator/${course.creatorId}`}>
              <a>
                {course.creatorName}
              </a>
            </Link>
            </Typography>
            <Typography variant='overline' className={classes.updatedtime}>
              {formattedLocaleDate(course.updated)}
            </Typography>
          </Grid>
        </Grid>
      }
      {course.featuredImage &&
        <div className={classes.featuredimagecontainer} />}
      {options.showEnrollmentArea &&
        <BuyButton
          course={course}
          onTransactionSuccess={() => {}}
          onTransactionFailure={() => {}} />
      }
      {courseDescriptionHydrated &&
        <TextEditor
          initialContentState={TextEditor.hydrate(course.description)}
          readOnly={true}/>}
    </article>
  )
}

Article.propTypes = {
  course: publicCourse.isRequired,
  options: PropTypes.shape({
    showAttribution: PropTypes.bool,
    showEnrollmentArea: PropTypes.bool
  }).isRequired
}

export default Article