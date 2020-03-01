import React from 'react'
import {
  View, Image, StyleSheet,
  Text, SafeAreaView, AsyncStorage,
  Alert, StatusBar, Platform
} from 'react-native'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'
import Draggable from '../Draggable'
import Button from '../Button'
import StyleGuide from '../StyleGuide'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import Slider from "react-native-slider";
import Token from '../Token'
import * as FileSystem from 'expo-file-system';




const getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('We need camera roll permissions so you can select your token or map image');
    }
  }
}

const pickToken = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1
  });

  if (!result.cancelled) {
    return result.uri
  }

  return ''
};

const pickMap = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1
  });

  if (!result.cancelled) {
    return result.uri
  }

  return ''
};

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight;

function StatusBarPlaceHolder() {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: "black",
						zIndex: 20
        }}>
            <StatusBar
                barStyle="light-content"
            />
        </View>
    );
}

function onMoveDefault() {
  console.log("My On Move called.")
}

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      characters: [],
      mapImage: props.mapUrl,
			gridScale: 25
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
				fetch('https://kylona.com/rpgMap/rpgMapData')
				.then((response) => response.json())
				.then((characters) => {
					if (characters) {
						const newState = this.state
						newState.characters = characters
						this.setState(newState)
					} else {
						this.setState({ characters: [] })
					}
				})
			

    AsyncStorage.getItem('mapImage')
      .then(mapImageString => {
        const mapImage = JSON.parse(mapImageString)
        if (mapImage) {
          const newState = this.state
          newState.mapImage = mapImage
          this.setState(newState)
        }
      })
  }

  saveData () {
    AsyncStorage.setItem('characters', JSON.stringify(this.state.characters))
  }

	sendData () {
    AsyncStorage.getItem('characters')
      .then(charactersString => {
				fetch('https://kylona.com/cgi-bin/updateRPGMap.pl', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: charactersString
				});
      })
	}


  confirmDeleteAllPlayers = async () => {
    return new Promise((resolve) => {
      const title = 'Are you sure you want to clear the map?'
      const message = 'This will clear all tokens from the map.'
      const buttons = [
        {
          text: 'Cancel',
          onPress: () => resolve(false)
        },
        {
          text: 'Delete',
          onPress: () => {
            resolve(true)
          }
        }]
      Alert.alert(title, message, buttons, { cancelable: false })
    })
  }

  render () {

		const styles = {
			image: {
				flex: 1,
				width: '100%',
				height: null,
				zIndex: -1
			},
			main: {
				padding: StyleGuide.spacing,
				backgroundColor: 'black'
			},
			character: {
				flex: 0,
				marginLeft:	-this.state.gridScale/2,
				marginRight: -this.state.gridScale/2,
				marginTop:  -this.state.gridScale/2,
				marginBottom: 0.001 + -this.state.gridScale/2,  //needed offset to prvent oclusion
				height: this.state.gridScale,
				width: this.state.gridScale,
				borderRadius: this.state.gridScale/5,
				borderWidth: this.state.gridScale/25,
				borderColor: 'black'
			},
			header: {
				flexDirection: 'row',
				alignItems: 'space-around',
				justifyContent: 'center',
				zIndex: 1,
				backgroundColor: 'black'
			},
			tokenDock: {
				flex: -1,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
			},
			footer: {
			},
			headerText: {
				color: 'white',
				margin: 10
			},
			gridStyle: {
				position: 'absolute'
			}
		}
    const characters = this.state.characters.map(character => {
      return (
        <Token
					key={character.name}
					xPos={character.x}
					yPos={character.y}
          onMove={(xPos, yPos) => {
            character.x = xPos
            character.y = yPos
            this.saveData()
            this.sendData()
          } }
					>
          <Image source={{ uri: character.image }} style={[styles.character]}/>
        </Token>
      )
    })

    return (
			<View style={{flex: 1}}>
				<StatusBarPlaceHolder/>

				<SafeAreaView style={{ flex: 1, paddingTop: STATUS_BAR_HEIGHT}}>
					<View style={styles.header}>
						<Button
							onPress={async () => {
								await getPermissionAsync()
								const image = await pickMap()
								if (image !== '') {
									this.state.mapImage = image
									await AsyncStorage.setItem('mapImage', JSON.stringify(image))
								}
								await this.fetchData()
							}}
						>
							<Text>Change Map</Text>
						</Button>
						<Button
							onPress={async () => {
								await getPermissionAsync()
								const image = await pickToken()
								if (image !== '') {
									const characters = [...this.state.characters]
									characters.push({
										name: 'Token' + characters.length,
										image,
										x: 100,
										y: 200,
									})
									await AsyncStorage.setItem('characters', JSON.stringify(characters))
								}
								await this.fetchData()
							}}
						>
							<Text>Add Token</Text>
						</Button>
						<Button
							onPress={async () => {
								const confirmed = await this.confirmDeleteAllPlayers()
								if (confirmed) {
									await AsyncStorage.removeItem('characters')
									this.fetchData()
								}
							}}
						>
							<Text>Clear Map</Text>
						</Button>
					</View>
					<View style={styles.header}>
						<Slider
							value={this.state.gridScale}
							onValueChange={(value) => {
								const newState = this.state
								newState.gridScale = value
								this.setState(newState)
							}}
							style={{width: 200, height: 40}}
							minimumValue={5}
							maximumValue={50}
							minimumTrackTintColor="#78c5ef"
							maximumTrackTintColor="#FFFFFF"
							thumbTintColor='#3170f5'
						/>
					</View>
					<ReactNativeZoomableView
						maxZoom={2}
						minZoom={1}
						zoomStep={0.5}
						initialZoom={1}
						bindToBorders={true}
						// onZoomAfter={this.logOutZoomState}
						style={styles.main}
					>
						<View style={styles.tokenDock}>
							{characters}
						</View>
						<Image style={styles.image}
							source={{ uri: this.state.mapImage }}
							resizeMode="contain" />
					</ReactNativeZoomableView>
					<View style={styles.footer} />
				</SafeAreaView>

				
			</View>
    )
  }
}


export default Main
