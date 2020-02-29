import React, { useState, useEffect } from 'react';
import { Animated, Text, View } from 'react-native';

const Token = (props) => {
  const state = {
    pan: new Animated.ValueXY()
  }
  const [xPos, yPos] = useState(new Animated.ValueXY(), new Animated.Value(0))  
  React.useEffect(() => {
    Animated.timing(
      xPos,
      {
        toValue: 1,
        duration: 10000,
      }
    ).start();
  }, [])

	const translateX =  () => {
		xPos
	}
	const translateY = () => {
		yPos
	}
	

  return (
    <Animated.View                 // Special animatable View
			style={{
				opacitykk
			}}
    >
      {props.children}
    </Animated.View>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:
export default Token
