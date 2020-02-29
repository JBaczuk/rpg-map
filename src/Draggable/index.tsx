import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import PropTypes from 'prop-types'
import { useMemoOne as useMemo } from 'use-memo-one'

import {
  PanGestureHandler,
  State
} from 'react-native-gesture-handler'
import { onGestureEvent, useValues } from 'react-native-redash'

const {
  cond, and, not, clockRunning, startClock,
  set, add, eq, diffClamp, block, decay,
  stopClock, Clock, spring
} = Animated
const { width: windowWidth, height: windowHeight } = Dimensions.get('window')
// height - Constants.statusBarHeight - (Platform.OS === 'ios' ? 44 : 52)

const withDiff = (value, gestureState, offset) => {
  return useMemo(() => cond(
    eq(gestureState, State.END),
    [
      set(offset, add(offset, value)),
      offset
    ],
    add(offset, value)
  ), [])
}

const withDecay = (value, gestureState, offset, velocity) => {
  const [finished, position, time] = useValues([0, 0, 0], [])
  const clock = useMemo(() => new Clock())
  const state = {
    finished,
    velocity,
    position,
    time
  }
  const config = {
    deceleration: 0.98
  }
  return useMemo(() => block([
    cond(eq(gestureState, State.BEGAN),
      [
        set(offset, state.position),
        stopClock(clock)
      ]
    ),
    cond(
      eq(gestureState, State.END),
      [
        cond(and(not(clockRunning(clock)), not(state.finished)), [
          set(state.time, 0),
          startClock(clock)
        ]),
        decay(clock, state, config),
        cond(state.finished, [
          set(offset, state.position),
          stopClock(clock)
        ])
      ],
      [
        set(state.finished, 0),
        set(state.position, add(offset, value))
      ]
    ),
    state.position
  ]), [])
}

const withSpring = (value, gestureState, offset, velocity, snap) => {
  const [finished, position, time] = useValues([0, 0, 0], [])
  const clock = useMemo(() => new Clock())
  const state = {
    finished,
    velocity,
    position,
    time
  }
  const config = {
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: snap
  }
  return useMemo(() => block([
    cond(eq(gestureState, State.BEGAN),
      [
        set(offset, state.position),
        stopClock(clock)
      ]
    ),
    cond(
      eq(gestureState, State.END),
      [
        cond(and(not(clockRunning(clock)), not(state.finished)), [
          set(state.time, 0),
          startClock(clock)
        ]),
        spring(clock, state, config),
        cond(state.finished, [
          set(offset, state.position),
          stopClock(clock)
        ])
      ],
      [
        set(state.finished, 0),
        set(state.position, add(offset, value))
      ]
    ),
    state.position
  ]), [])
}

function Draggable (props) {
  const {
    animatedViewWidth, animatedViewHeight,
    containerWidth, containerHeight, startX, startY,
  } = props

  const [state,
    translationX,
    translationY,
    offsetX,
    offsetY,
    velocityX,
    velocityY,
    snapX,
    snapY
  ] = useValues([State.UNDETERMINED, 0, 0, 0, 0, 0, 0, 0, 0], [])
  state.position = {startX, startY}

  const gestureHandler = useMemo(() => onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY
  }), [])

  // using both clamps messes everything up for some reason
  const translateX = // diffClamp(
    withDiff(translationX, state, offsetX, velocityX, snapX)//,
  //   (animatedViewWidth / 2) - (containerWidth / 2),
  //   (containerWidth / 2) - (animatedViewWidth / 2)
  // )
  const translateY = // diffClamp(
    withDiff(translationY, state, offsetY, velocityY, snapY)//,
  //   (animatedViewHeight / 2) - (containerHeight / 2),
  //   (containerHeight / 2) - (animatedViewHeight / 2)
  // )

  return (
    <PanGestureHandler
      {...gestureHandler}
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

Draggable.propTypes = {
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
  animatedViewWidth: PropTypes.number,
  animatedViewHeight: PropTypes.number
}

Draggable.defaultProps = {
  animatedViewWidth: 100,
  animatedViewHeight: 100,
  containerWidth: windowWidth,
  containerHeight: windowHeight
}

export default Draggable
