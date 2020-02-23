import React, { useState } from 'react'
import {
  TouchableWithoutFeedback,
  Text, ScrollView
} from 'react-native'
import Animated, { Easing, interpolate } from 'react-native-reanimated'
import { withTimingTransition, useValues, withTransition, useTransition, useSpringTransition } from 'react-native-redash'
import StyleGuide from '../StyleGuide'
import PropTypes from 'prop-types'

function Button (props) {
  const [pressed, setPressed] = useState(0)
  // const scale = pressed ? 0.8 : 1
  const transition = useTransition(pressed, { duration: 50 })
  const scale = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [1, 0.9]
  })
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        setPressed(1)
      }}
      onPressOut={() => {
        setPressed(0)
        props.onPress()
      }}
    >
      <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const styles = {
  button: {
    padding: StyleGuide.spacing,
    margin: StyleGuide.spacing,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: StyleGuide.spacing / 2,
    backgroundColor: 'cyan'
  },
  buttonText: {
    fontSize: StyleGuide.fontSize,
    color: 'white'
  }
}

Button.propTypes = {
  label: PropTypes.string
}

Button.defaultProps = {
  label: 'Button'
}

export default Button
