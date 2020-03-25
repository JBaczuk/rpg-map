import React from 'react'
import {
  AsyncStorage,
} from 'react-native'
import * as Permissions from 'expo-permissions'

class Server {
  static async save(game_key, data_key, data) {
    return await fetch('https://kylona.com/cgi-bin/uploadData.pl',
          {method: 'POST',
				   headers: {
					   Accept: 'application/json',
					   'Content-Type': 'application/json',
				  },
				  body: game_key + ":<>:" + data_key + ":<>:" + data
			    });
  }

  static async load(game_key, data_key, data) {
    let response = await fetch('https://kylona.com/rpgMap/' + game_key + '/' + data_key);
    body = response.text()
    return await body;
  }

}

export default Server
