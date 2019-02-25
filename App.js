import React from 'react';
import { 
  Text, View, TouchableOpacity,
  Image, CameraRoll, ToastAndroid,
  ActivityIndicator, Button, Dimensions
 } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraExample extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      imgRoll: null,
      img: null,
      saving: false,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      window: Dimensions.get('window')
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
      this.setState({saving: true});
      //Tira a foto
      let photo = await this.camera.takePictureAsync();
      //Salva a foto no state da aplicação
      this.setState({saving: false,img: photo});  
      //Salva a foto no rolo da camera. Podemos salvar em outro lugar futuramente
      //await CameraRoll.saveToCameraRoll(photo.uri, 'photo');
    }
  }

  // Esse metodo será utilizado futuramente para o botao SALVAR IMG após a pessoas tirar a foto
  save = async () => {
    const { img } = this.state; 
    await CameraRoll.saveToCameraRoll(img.uri, 'photo');
    this.toastRodape("Imagem salva");
    this.cancel();

  }

  toastRodape = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  } 

  cancel = () => {
    this.setState({img: null})
  }

  renderImg(){
    const { img, window } = this.state;
    //Renderiza a img na tela. Os valores 400 e 700 sao numeros que coloquei de teste
    return (
      <View style={{flex:1, backgroundColor: 'black'}}>
        {/* TOPO */}
        <View style={{flex:1}}>
          <Text style={{flex:1, fontSize: 18, color: 'white', textAlignVertical: 'center',textAlign: 'center'}}>
            Captura
          </Text>
        </View>

        {/* CORPO */}
        <Image 
          style={{
            backgroundColor: 'transparent',
            flex: 3,
            resizeMode: 'contain'
          }}
          source={{uri: img.uri}}
        />

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
    const { saving } = this.state;
    //Exibe a camera na tela cheia
    return (
      <View style={{flex:1, zIndex: 1}}>
        <Camera
          ref={ref => {this.camera = ref;}}
          style={{ flex: 1 }}
          type={this.state.type}
          ratio="16:9">
          <View
            style={{
              flex:1,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center'
            }}>
            <TouchableOpacity style={{alignSelf: 'flex-end', alignItems: 'center'}} onPress={this.snap}>
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
                  backgroundColor: 'gray'
                }}>
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, img, saving } = this.state;
    if (hasCameraPermission === null) { //Checa as permissoes
      return <View />;
    } else if (hasCameraPermission === false) { //Checa se permissoes foram negadas
      return <Text>No access to camera</Text>;
    } else {
      //Checa se há img salva no state para exibir
      let rendered = img ? this.renderImg() :  this.renderCamera();
      //Exibe um dos metodo
      return (
        <View style={{ flex: 1 }}>
         <ActivityIndicator
            style={{
              flex: 1,
              position: 'absolute',
              zIndex: 9,
              alignSelf: 'stretch',
              textAlign: 'center',
              width: '100%',
              height: '100%'
            }}
            animating={saving}
            color="red"
            size="large"
          />
          {rendered}
        </View>
      );
    }
  }
}