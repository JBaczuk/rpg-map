import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import PropTypes from 'prop-types'
import { useMemoOne as useMemo } from 'use-memo-one'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { onGestureEvent, useValues } from 'react-native-redash'

const { cond, and, not, set, add, eq } = Animated

const withDiff = (value, gestureState, offset, onMove) => {
  return useMemo(() => cond(
    eq(gestureState, State.END),
    [
      set(offset, add(offset, value)),
    ],
    add(offset, value)
  ), [])
}

function Token (props) {
  const {
    xPos,
    yPos,
    onMove
  } = props

  const [state,
    translationX,
    translationY,
    offsetX,
    offsetY,
    velocityX,
    velocityY,
    snapX,
    snapY,
  ] = useValues([State.UNDETERMINED, 0, 0, 0, 0, 0, 0, 0, 0], [])

  const gestureHandler = useMemo(() => onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY
  }), [])

  const translateX = withDiff(translationX, state, offsetX, onMove)
  const translateY = withDiff(translationY, state, offsetY, onMove)

  return (
    <PanGestureHandler
      {...gestureHandler}
      //onHandlerStateChange={onMove}
    >
      <Animated.View
        style={{
          transform: [
            { translateX },
            { translateY }
          ]
        }}
      >
        {props.children}
      </Animated.View>
    </PanGestureHandler>
  )
}

Token.propTypes = {
  xPos: PropTypes.number,
  yPos: PropTypes.number,
  onMove: PropTypes.func
}

Token.defaultProps = {
  xPos: 0,
  xPos: 0,
  onMove: () => { console.log("Defualt On Move Called") }
}

export default Token
