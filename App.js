import React from 'react';
import { 
  Text, View, TouchableOpacity,
  Image, CameraRoll, ToastAndroid,
  Button, Dimensions
 } from 'react-native';
import { Camera, Permissions, Video } from 'expo';

export default class CameraExample extends React.Component {
  
  state = {
    recording: false,
    content: null,
    saving: false,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    window: Dimensions.get('window'),
    blink: false
  }

  //ENUM 
  contentType = {
    PHOTO: 'photo',
    VIDEO: 'video'
  }

  async componentDidMount() {
    const { recording, blink } = this.state;
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL, Permissions.AUDIO_RECORDING);
    this.setState({ hasCameraPermission: status === 'granted' });
    setInterval(()=>{ if(recording) this.setState({blink: !blink}) }, 1000)
  }

  onPressCamera = async () => {
    if (this.camera) {
      //==========Stop recording============
      const { recording } = this.state;
      if(recording){
        this.camera.stopRecording();
        this.setState({recording: false, saving: true});
        return false;
      }
      //==========Take a picture============
      this.setState({saving: true});
      //Tira a foto
      let photo = await this.camera.takePictureAsync();
      photo.type = this.contentType.PHOTO;
      //Salva a foto no state da aplicação
      this.setState({saving: false, content: photo});
    }
  }

  // Esse metodo será utilizado futuramente para o botao SALVAR IMG após a pessoas tirar a foto
  save = async () => {
    const { content } = this.state; 
    await CameraRoll.saveToCameraRoll(content.uri, content.type);
    this.toastRodape("Conteúdo salvo no rolo da camera");
    this.cancel();

  }

  record = async () => {
    if(this.camera){
      this.setState({recording: true})
      let video = await this.camera.recordAsync()
      video.type = this.contentType.VIDEO;
      this.setState({saving: false, content: video});
    }
  }

  toastRodape = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
  } 

  cancel = () => {
    this.setState({content: null})
  }

  renderContent(){
    const { content, window } = this.state;
    let contentRendered;
    switch(content.type){
      case this.contentType.PHOTO:
        contentRendered = (
          <Image 
            style={{
              backgroundColor: 'transparent',
              flex: 3,
              resizeMode: 'contain'
            }}
            source={{uri: content.uri}}
          />
        )
        break;
      case this.contentType.VIDEO:
        contentRendered = (
          <Video
            source={{ uri: content.uri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            useNativeControls={true}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            shouldPlay
            isLooping
            style={{
              backgroundColor: 'transparent',
              flex: 3
            }}
          />
        )
        break;
    }
    //Renderiza o conteudo na tela. Os valores 400 e 700 sao numeros que coloquei de teste
    return (
      <View style={{flex:1, backgroundColor: 'black'}}>
        {/* TOPO */}
        <View style={{flex:1}}>
          <Text style={{flex:1, fontSize: 18, color: 'white', textAlignVertical: 'center',textAlign: 'center'}}>
            Captura
          </Text>
        </View>

        {/* CORPO */}
        {contentRendered}

        {/* RODAPE */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: window.width/2,
              padding: 20,
              borderRadius: 5,
              color: 'black'
            }}
          >
            <Button
              title="Save"
              color="green"
              onPress={this.save}
            />
          </View>

          <View 
            style={{
              alignSelf: 'center',
              width: window.width/2,
              padding: 20,
              borderRadius: 5,
              color: 'white'
            }}>
            <Button
              title="Cancel"
              color="red"
              onPress={this.cancel}
            />
          </View>
        </View>

      </View>
    )
  }

  renderCamera() {
    const { saving, recording, blink } = this.state;
    //Exibe a camera na tela cheia
    return (
      <View style={{flex:1, zIndex: 1}}>
        <Camera
          ref={ref => {this.camera = ref;}}
          style={{ flex: 1 }}
          type={this.state.type}
          ratio="16:9">

          {/* REC SYMBOL */}
          <View
            style={{
              display: blink ? 'flex' : 'none',
              flex:1,
              flexDirection: 'row',
              position: 'absolute',
              zIndex: 9,
              alignSelf: "flex-start",
              right: 0
            }}
          >
            <Text style={{
                backgroundColor: 'red',
                borderRadius: 35/2,
                width: 35,
                height: 35,
                marginTop: 50,
                marginRight: 5
              }}
            ></Text>
            <Text style={{
                color: 'red',
                fontSize: 30,
                marginTop: 47,
                marginRight: 20
              }}
            >REC</Text>
          </View>

          <View
            style={{
              flex:1,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center'
            }}>
            <TouchableOpacity 
              style={{alignSelf: 'flex-end', alignItems: 'center'}}
              onPress={this.onPressCamera} onLongPress={this.record}>
              <Text
                style={{
                  width: 80,
                  height: 80,
                  fontSize: 18,
                  marginBottom: 30,
                  borderRadius: 80/2,
                  borderWidth: 7,
                  borderColor: 'white',
                  textAlign: 'center',
                  backgroundColor: recording ? 'red' : 'gray'
                }}>
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, content, saving } = this.state;
    if (hasCameraPermission === null) { //Checa as permissoes
      return <View />;
    } else if (hasCameraPermission === false) { //Checa se permissoes foram negadas
      return <Text>No access to camera</Text>;
    } else {
      //Checa se há img salva no state para exibir
      let rendered = content ? this.renderContent() :  this.renderCamera();
      //Exibe um dos metodo
      return (
        <View style={{ flex: 1 }}>
          
          {rendered}
        </View>
      );
    }
  }
}