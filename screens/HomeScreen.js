import React, {
  Component,
} from 'react';
import {
  Alert,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Button,
  TouchableHighlight
} from 'react-native';

import Backend from './DataModification';

import SudokuGrid from 'react-native-smart-sudoku-grid';
import { StackNavigator } from 'react-navigation';

import { scale, verticalScale, moderateScale } from './Scale';


import bgPic from './img/BlueIcon.png';
import grayBgPic from './img/IconGray.png';
import orangeBgPic from './img/IconYellow.png';

const columnCount = 3

export default class HomeScreen extends Component {

  static navigationOptions = {
    title: 'Aut2Talk',
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      useDeleteMode: false,
      useEditMode: false,
    };
    Backend.load().then(() => { this.setState({ list: Backend.userData }); });
  }

  render() {

    const { navigate } = this.props.navigation;
    
    if(this.state.useEditMode){
      return (
        <View style={mainUIStyles.wholeScreen}>
  
          <ScrollView style={mainUIStyles.scrollView} showsVerticalScrollIndicator={false}>
            <SudokuGrid
              containerStyle={{}}
              columnCount={columnCount}
              dataSource={this.state.list}
              renderCell={this._renderGridCell}
            />
          </ScrollView>
  
          <Image style={toolbarStyles.toolbarEditing} source={require('./img/Toolbar.png')}>
            <View style={{marginLeft:10}}>
              <Button
                onPress={() => {this.setState({useEditMode:false});}} title = "Leave Edit Mode" color ='orange'
              />
            </View>
          </Image>
  
        </View>
      )
    }
    else if(this.state.useDeleteMode){
      return (
        <View style={mainUIStyles.wholeScreen}>
  
          <ScrollView style={mainUIStyles.scrollView} showsVerticalScrollIndicator={false}>
            <SudokuGrid
              containerStyle={{}}
              columnCount={columnCount}
              dataSource={this.state.list}
              renderCell={this._renderGridCell}
            />
          </ScrollView>
  
          <Image style={toolbarStyles.toolbarDeleting} source={require('./img/Toolbar.png')}>
            <View style={{marginRight:10}}>
              <Button
                onPress={() => {this.setState({useDeleteMode:false});}} title = "Leave Delete Mode" color ='red'
              />
            </View>
          </Image>
  
        </View>
      )
    }
    else{
      return (
        <View style={mainUIStyles.wholeScreen}>
  
          <ScrollView style={mainUIStyles.scrollView} showsVerticalScrollIndicator={false}>
            <SudokuGrid
              containerStyle={{}}
              columnCount={columnCount}
              dataSource={this.state.list}
              renderCell={this._renderGridCell}
            />
          </ScrollView>
  
          <Image style={toolbarStyles.toolbar} source={require('./img/Toolbar.png')}>
            <View style={{flex:1}}>
              <TouchableHighlight onPress={this._toggleEditMode} style={toolbarStyles.toolbarButton} underlayColor="white">
                <Image style={toolbarStyles.toolbarButtonImage} source={require('./img/Edit.png')} />
              </TouchableHighlight>
            </View>
            <View style={{flex:1}}>
              <TouchableHighlight onPress={() => navigate('Record')} style={toolbarStyles.toolbarButton} underlayColor="white">
                <Image style={toolbarStyles.toolbarButtonImage} source={require('./img/Add.png')} />
              </TouchableHighlight>
            </View>
            <View style={{flex:1}}>
              <TouchableHighlight onPress={this._toggleDeleteMode} style={toolbarStyles.toolbarButton} underlayColor="white">
                <Image style={toolbarStyles.toolbarButtonImage} source={require('./img/Delete.png')} />
              </TouchableHighlight>
            </View>
          </Image>
  
        </View>
      )
    }

  }
  _toggleDeleteMode = () => {
    // only toggle delete if list is not empty
    if (this.state.list.length > 0) {
      this.setState({ useDeleteMode: !this.state.useDeleteMode , useEditMode:false });
    }
  }

  _toggleEditMode = () => {
    if (this.state.list.length > 0) {
      this.setState({ useEditMode: !this.state.useEditMode , useDeleteMode:false });
    }
  }

  _renderGridCell = (data, index, list) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableHighlight
        style={gridStyles.button}
        underlayColor={'#eee'}
        onPress={() => {
          if (this.state.useDeleteMode) {
            // pop up confirmation 
            Alert.alert('Delete',
              'Are you sure you want to delete?', [
                {
                  text: 'Cancel',
                  onPress: () => { }
                }, {
                  text: 'Delete',
                  onPress: () => {
                    Backend.delete(index);
                    this.setState({ list: Backend.userData });
                  }
                }]);

          } else if(this.state.useEditMode) {
            this.setState({useEditMode:false});
            navigate('Edit', { isNewData: false, index: index, text: data.text, emoji: data.emoji, videoPath: data.videoPath });
          } else{
            navigate('Play', { text: data.text, emoji: data.emoji, videoPath: data.videoPath });
          }
        }}>
        <View style={gridStyles.buttonView}>
          <Image style={gridStyles.buttonImage} source={this.state.useDeleteMode ? grayBgPic : (this.state.useEditMode ? orangeBgPic : bgPic)} >
            <Text style={gridStyles.buttonEmoji}>{data.emoji}</Text>
          </Image>
          <Text style={gridStyles.buttonText} numberOfLines={1} >{data.text}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}



const mainUIStyles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    flexDirection: 'column',
    //marginTop: 20,
    //backgroundColor: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor: '#AAAAAA',
  },
})

const gridStyles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: '15%',
    marginTop: '10%',
    marginBottom: '5%',
    // backgroundColor: '#444444',
  },

  buttonView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: '#000000',
  },

  buttonImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
    // backgroundColor: 'blue',
  },

  buttonEmoji: {
    fontSize: scale(50),
  },

  buttonText: {
    color: 'black',
    fontSize: 14,
    margin: 5
  }
})


const toolbarStyles = StyleSheet.create({
  toolbar: {
    flex: 0.082,
    width: '100%',
    resizeMode: 'stretch',

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  toolbarEditing: {
    flex: 0.082,
    width: '100%',
    resizeMode: 'stretch',

    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  toolbarDeleting: {
    flex: 0.082,
    width: '100%',
    resizeMode: 'stretch',

    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  toolbarButton: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#444444',
  },

  toolbarButtonImage: {
    height: '60%',
    aspectRatio: 1,
    resizeMode: 'contain',
    //backgroundColor: 'blue',
  },

})