import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'

const dummyPlayers = [{
  name: 'Kylona',
  image: 'https://i.pinimg.com/originals/c7/fe/25/c7fe251cd11a2ecb590d7d9efa596a49.png',
  x: 150,
  y: 450,
  color: 'red'
}, {
  name: 'JBaczuk',
  image: 'https://i.pinimg.com/originals/81/11/10/81111081508e4e7bd138890ab2cdf9dd.png',
  x: 200,
  y: 500,
  color: 'blue'
}]
function Main (props) {
  const { mapUrl } = props

  const players = dummyPlayers.map(player => {
    const imageStyle = {
      position: 'absolute',
      top: player.y,
      bottom: 0,
      left: player.x,
      right: 0,
      backgroundColor: player.color
    }
    return (
      <View style={[imageStyle, styles.player]}>
        <Image key={player.name} source={{ uri: player.image }} style={[styles.playerImage]} />
      </View>
    )
  })

  return (
    <View style={{ flex: 1 }}>
      <ReactNativeZoomableView
        maxZoom={2}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        // onZoomAfter={this.logOutZoomState}
        style={styles.main}
      >
        {players}
        <Image style={styles.image}
          source={{ uri: mapUrl }}
          resizeMode="contain" />
      </ReactNativeZoomableView>
    </View>
  )
}

const styles = {
  image: {
    flex: 1,
    width: '100%',
    height: null,
    zIndex: -1
  },
  playerImage: {
    height: 20,
    aspectRatio: 0.5
  },
  main: {
  },
  player: {
    height: 25,
    width: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4
  }
}

export default Main
