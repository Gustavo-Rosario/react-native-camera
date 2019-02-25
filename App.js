import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';

export default class CameraExample extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      img: null,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
    this.renderImg = this.renderImg.bind(this);
    this.renderCamera = this.renderCamera.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({img: photo});      
    }
  }

  save = async () => {
    await FileSystem.copyAsync({
      from: `file://${photo.uri}`,to: `${FileSystem.documentDirectory}imgs/teste2.jpg` });
  }

  renderImg() {
    const { img } = this.state.img;
    return <Image style={{width: img.width, height: img.height}} source={img.uri} />
  }

  renderCamera() {
    return (
      <View style={{flex:1}}>
        <Camera ref={ref => {this.camera = ref;}} style={{ flex: 1 }} type={this.state.type}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            

            <TouchableOpacity
              style={{
                flex: 0.2,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={this.snap}>
              <Text
                style={{ width: 50, fontSize: 18, marginBottom: 10, color: 'white' }}>
                {' '}Picture{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, imgUri } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      let rendered = img ? this.renderImg() :  this.renderCamera();
      return (
        <View style={{ flex: 1 }}>
          {rendered} 
        </View>
      );
    }
  }
}