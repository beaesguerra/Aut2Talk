import React, { Component } from 'react';
import {Text, StyleSheet, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import Video from 'react-native-video';
import Backend from './DataModification';
import { NavigationActions } from 'react-navigation';

export default class EditScreen extends Component {
    static navigationOption = {
      title: 'Add',
    };

    constructor(props) {
        super(props);
        this.state = {
          text: '',
          emoji: '',
          paused: false,
        };
    }

    render() {
      const { navigate } = this.props.navigation;
      const { params } = this.props.navigation.state;

      return (
          <ScrollView
            scrollEnabled={false}
            contentContainerStyle={styles.container}
          >
            <Text style = {styles.baseText}>Please enter Emotion/Activity Name:</Text>
            <TextInput
              style={styles.textInput}
              placeholder={params.isNewData ? 'Emotion/Activity Name' : params.text}
              onChangeText={(text) => {
                this.setState({text});
              }}
            />
            <Text style = {styles.baseText}>Please choose an emoji to describe it:</Text>
            <TextInput
              style={styles.textInput}
              placeholder={params.isNewData ? 'Emoji' : params.emoji}
              onChangeText={(emoji) => this.setState({emoji})}
            />

            <Video
              source={{uri: params.videoPath}}   // Can be a URL or a local file.
              rate={1.0}
              resizeMode="cover"                       
              volume={1.0}                            // 0 is muted, 1 is normal.
              muted={false}                           // Mutes the audio entirely.
              paused={this.state.paused}                          // Pauses playback entirely.
              repeat={true}                           // Repeat forever.
              playInBackground={false}                // Audio continues to play when app entering background.
              style={styles.backgroundVideo}
            />

            <View style={styles.button}>
              <Button
                onPress={
                  () => {
                    console.log(this.state);
                    this.setState({paused: true});
                    console.log('DataParams'+ params.isNewData + params.index + params.videoPath + this.state.text + this.state.emoji);

                    if(params.isNewData){
                      Backend.appendData(this.state.emoji,params.videoPath,this.state.text);
                    }
                    else{
                      Backend.edit(params.index,this.state.emoji,params.videoPath,this.state.text);
                    }
                    
                    this.props.navigation.dispatch(NavigationActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({ routeName: 'Home' })
                      ]
                    }))
                  }
                }
                title = "Confirm"
              />
            </View>
          </ScrollView>
      );
    }

}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection:'column',
  },

  backgroundVideo: {
    flex:1,
    width:'100%',
    backgroundColor: '#E9E9EF',
    marginTop:5,
  },


  baseText: {
    marginTop:12,
    marginBottom:6,
    marginHorizontal:8,
    fontSize: 16,
    color: '#444',
  },

  textInput:{
    height: 45, 
    width: '100%', 

    borderTopWidth: 1,//StyleSheet.hairlineWidth, 
    borderBottomWidth: 1,//StyleSheet.hairlineWidth, 
    borderColor: '#ddd',

    paddingLeft:10,
    fontSize:16, 
    backgroundColor: '#ffffff' 
  },

  button:{
    height: 45, 
    width: '100%', 

    borderTopWidth: 1,//StyleSheet.hairlineWidth, 
    borderBottomWidth: 1,//StyleSheet.hairlineWidth, 
    borderColor: '#ddd',

    marginVertical:5,
    paddingLeft:10,
    backgroundColor: '#ffffff' 
  },
});
