import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView,Modal } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialTabs from 'react-native-material-tabs';
import { useMMKVStorage } from "react-native-mmkv-storage";
import {LineChart} from "react-native-chart-kit";
import {Calendar} from 'react-native-calendars';
import {Dimensions} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign'

import Header from '../Shared/Header'
import MMKV from '../../functions/mmks';

const Sales = ({navigation}) => {
  const name='Sales & Invoices'

  const windowWidth = Dimensions.get('window').width;
  
  const [selectedTab, setSelectedTab] = useState(0);
  
  const [myRecords, setMyRecords] = useMMKVStorage("sales", MMKV,[]);
  const [chartRecord, setChartRecord] = useState([]);
  const [invoice,setInvoice]=useState([])
  const [labelsArr, setLabelsArr] = useState([]);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser]=useState("")
  const [income, setIncome]=useState("")
  const [revenue, setRevenue]=useState("")
  const [expense, setExpense]=useState("")
  
  const [modalVisible, setModalVisible] = useState(false);
  const [graphModalVisible, setGraphModalVisible] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [endBtn, setEndBtn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createChartData()
    _retrieveData()
    calCulation()
  }, [])

  useEffect(() => {setInvoice(myRecords)}, [])

  const _retrieveData = async ()=>{
    const value = await AsyncStorage.getItem('@username')
    console.log(value)
    setUser(value)
  };
  
   function createChartData(){

    let tempData = [...chartRecord]
    let tempDataLabels = [...labelsArr]

    if(myRecords.length >= 1){
      myRecords.forEach((x,index)=>{
        tempData.push(x.s_price)
        })
      setChartRecord(tempData)
      //console.log('=========ChartRecord',tempData)
      myRecords.forEach((x,index)=>{
        tempDataLabels.push(x.month,)
        setLabelsArr('Over All')
        })
    //console.log('=========ChartDataLabels',tempDataLabels)
      } if(myRecords.length < 1) {
        setChartRecord([0,0,0,0,0,0,0,0])
        setLabelsArr('No Sales')
      }
    setLoading(false)  
  }
  
  const calCulation = () => {
    console.log(myRecords)
    let tempRevenue = 0
    let tempIncome = 0
    let tempCost = 0
    myRecords.forEach((x,index)=>{    
      tempCost= tempCost + x.c_price + x.c_price
      tempRevenue = tempRevenue + x.s_price + x.s_price
      setRevenue(tempRevenue)
      tempIncome= tempIncome + x.s_price - x.c_price
      setIncome(tempIncome)
      setExpense(tempCost)
    })
  }

  const handleClick =({val,selectType,ref})=>{
  if(selectType == 'open' && ref == '1'){
      setStartBtn(true)
      setGraphModalVisible(true)

  }
  if(selectType == 'open' && ref == '2'){
    setGraphModalVisible(true)
    setEndBtn(true)
  }

  if(selectType=='filterGraph'){

    if(startDate != '' && endDate == ''){
      let Data = []
      const tempData = myRecords.filter((x)=>`${x.year}-${x.month_num}-${x.day}`== startDate)
      tempData.forEach((x,index)=>{
        // console.log('===',tempData)
        // console.log('===',x.s_price)
        Data.push(x.s_price)
        setLoading(true)
        setLabelsArr(startDate)
        setChartRecord(Data)
        setLoading(false)}
        )}

    if(startDate && endDate != ''){
      let Data = []
      const tempData = myRecords.filter((x)=>`${x.year}-${x.month_num}-${x.day}`>= startDate && `${x.year}-${x.month_num}-${x.day}`<=endDate)
      tempData.forEach((x,index)=>{
        // console.log('===',tempData)
        // console.log('===',x.s_price)
        Data.push(x.s_price)
        setLoading(true)
        setLabelsArr([startDate, endDate])
        setChartRecord(Data)
        setLoading(false)}
        )}
  }}

  return (
    <>
     {graphModalVisible && (
        <View
          style={{
            position: 'absolute',
            opacity: 0.6,
            zIndex: 1,
            backgroundColor: 'grey',
            height: '200%',
            width: '100%',
          }}></View>
      )}
    <Header navigation={navigation} name={name}/>
    <MaterialTabs
        uppercase={false}
        items={['Sales', 'Invoices']}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
        barColor="#1A6DBB"
        indicatorColor="white"
        indicatorHeight={3}
        textStyle={{color:'white'}}
        activeTextColor="white"
      />
    {selectedTab==0&&<><View style={styles.container}>
      <View style={Row}>
      <View style={Col}>
       <View style={styles.Box}>
          <View style={Grid}>
            {!startDate&&<TouchableOpacity onPress={({val='',selectType='open',ref='1'})=>(handleClick({val,selectType,ref}))}  style={styles.date_select}><Text style={{color:'white'}}>Select Start Date</Text></TouchableOpacity>}
            {startDate&&<TouchableOpacity onPress={({val='',selectType='open',ref='1'})=>(handleClick({val,selectType,ref}))}  style={styles.date_select}><Text style={{color:'white',fontWeight:'600',fontSize:16}}>{startDate}</Text></TouchableOpacity>}
            {!endDate&&<TouchableOpacity onPress={({val='',selectType='open',ref="2"})=>(handleClick({val,selectType,ref}))}  style={styles.date_select}><Text style={{color:'white'}}>Select End Date</Text></TouchableOpacity>}
            {endDate&&<TouchableOpacity onPress={({val='',selectType='open',ref="2"})=>(handleClick({val,selectType,ref}))}  style={styles.date_select}><Text style={{color:'white',fontWeight:'600',fontSize:16}}>{endDate}</Text></TouchableOpacity>}
          </View>
          <View style={Grid}> 
          </View>
          <View>
          <TouchableOpacity onPress={({selectType='filterGraph'})=>(handleClick({selectType}))} style={styles.search_btn}><Text style={styles.btn_text}>Search</Text></TouchableOpacity>
       </View>
       </View>
       <View style={styles.Box_2}>
        {loading&&<View><Text>Loading...</Text></View>}
        {!loading && <LineChart
          data={{
            labels: [labelsArr],
            datasets: [{data:chartRecord}]
          }}
          width={windowWidth} // from react-native
          height={200}
          yAxisLabel=""
          yAxisSuffix="Rs"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{

            backgroundColor: "#020024",
            backgroundGradientFrom: "#1A6DBB",
            backgroundGradientTo: "#1A6DBB",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {borderRadius: 16},
            propsForDots: {r: "2",strokeWidth: "2",stroke: "#ffa726"}
          }}
          bezier
          style={{marginVertical: 8,borderRadius: 16}}
        />}
       </View>
       <View style={{flex:1, flexDirection:'row',margin:6,top:35}}>
          <View style={styles.Box_7}>
          <Text style={{fontWeight:'800',fontSize:18, color:'white',left:10}}>Revenue</Text>
            {revenue==''&&<Text style={{fontWeight:'800',fontSize:50, color:'white',left:10}}>Rs.0</Text>}
            {revenue&&<Text style={{fontWeight:'800',fontSize:50, color:'white',left:10}}>Rs. {revenue}</Text>}
          </View>
      </View>
      <View style={{flex:1, flexDirection:'row',margin:6,top:22}}>
          <View style={styles.Box_5}>
            <Text style={{fontWeight:'800',fontSize:18, color:'white',left:10}}>Income</Text>
            {income==''&&<Text  style={{fontWeight:'800',fontSize:46, color:'white',left:10}}>Rs.0</Text>}
            {income&&<Text  style={{fontWeight:'800',fontSize:46, color:'white',left:10}}>{income}</Text>}
            </View>
          <View style={styles.Box_6}>
          <Text style={{fontWeight:'800',fontSize:18, color:'white',left:10}}>Expense</Text>
           {expense==''&&<Text style={{fontWeight:'800',fontSize:46, color:'white',left:10}}>Rs.0</Text>}
           {expense&&<Text style={{fontWeight:'800',fontSize:46, color:'white',left:10}}>Rs.{expense}</Text>}
          </View>
      </View>
      
      </View>
      </View>
    <TouchableOpacity onPress={()=>{setMyRecords()}}><Text>clear</Text></TouchableOpacity>
    </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={graphModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <View>
            <TouchableOpacity onPress={()=>{setGraphModalVisible(false),setStartBtn(false),setEndBtn(false)}}><Icon name="close" style={{fontSize:28, alignSelf:'flex-end',left:23,bottom:23}}/></TouchableOpacity>
            <View style={{height:350,width:250}}>
            <Calendar 
                onDayPress={(x) => {
                  let val = x
                  let selectType = 'open'
                  if(startBtn == true){
                   setStartDate(x.dateString)
                  let ref = '1'
                  handleClick({val,selectType,ref})
                }
                 if(endBtn == true){
                  setEndDate(x.dateString)
                  let ref = '2'
                 handleClick({val,selectType,ref})
                }}}  
            />
            </View>
           </View>
          </View>
        </View>
      </Modal>

    </>}
    {selectedTab==1&&
    <>
     {modalVisible && (
        <View
          style={{
            position: 'absolute',
            opacity: 0.6,
            zIndex: 1,
            backgroundColor: 'grey',
            height: '200%',
            width: '100%',
          }}></View>
      )}
    <View style={{backgroundColor:'white'}}>
    {/* <TouchableOpacity><Icon name="close" style={{fontSize:28, alignSelf:'flex-end',color:"#1A6DBB",right:10}}/></TouchableOpacity> */}
    <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
    <TouchableOpacity onPress={()=>{setModalVisible(true)}}><Icon name="filter" style={{fontSize:28,color:"#1A6DBB", right:35}}/></TouchableOpacity>
    <TouchableOpacity onPress={()=>{setInvoice(myRecords)}}><Icon name="reload1" style={{fontSize:25,color:"#1A6DBB",right:20}}/></TouchableOpacity>
    </View>
    <ScrollView style={{backgroundColor:"white"}}> 
      {invoice.map((x,index)=>{
        return(
        <View key={index}>
          <Text style={{}}>{x.day} {x.month} {x.year}</Text>
          <TouchableOpacity style={styles.content} 
          onPress={() =>
          navigation.push('Invoices', {
            s_price:x.s_price,
            day:x.day,
            month:x.month,
            year:x.year,
            user:user,
            discount:x.discount,
            change_amount:x.change_amount,
            details:x.pd_details
          })}>
          <View style={{width:200, flexDirection:'row'}}>
          <Icon name="filetext1" style={{fontSize:28, alignSelf:'center',color:"#1A6DBB"}}/>
          <View style={{padding:10 ,maxWidth:300}}>
          <Text style={{fontWeight:'bold', fontSize:15}}>Invoice No. {index+1}</Text>
          <Text style={{color:'#1A6DBB',fontSize:15}}>{user}</Text>
          </View>
        </View>
        <View style={{alignSelf:'center',flexDirection:'row'}}>
          <Text style={{color:"black",fontSize:16}}>PKR </Text>
          <Text style={{color:"#1A6DBB",fontSize:16}}>{x.s_price}</Text>
        </View>
      </TouchableOpacity>
      </View>
      )})}
    </ScrollView>
  </View>
  <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <View>
            <TouchableOpacity onPress={()=>{setModalVisible(false)}}><Icon name="close" style={{fontSize:28, alignSelf:'flex-end',left:23,bottom:23}}/></TouchableOpacity>
            <View style={{height:350,width:250}}>
            <Calendar 
              onDayPress={(x) => {
                const filteredInvoice = myRecords.filter((y)=>y.day==x.day && y.month_num == x.month && y.year == x.year)
                setInvoice(filteredInvoice)
              }}
            />
             </View>
            </View>
            </View>
          </View>
        </Modal>
      </View>
     </>}
    </>
  )
}

export default Sales

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column',padding: 0, backgroundColor:"white"},
  Dropdown:{backgroundColor:'silver',margin:15, padding:5,borderRadius:8,width:100,},
  search_btn:{backgroundColor:"#1A6DBB", padding:8, width:100,justifyContent:'center' ,borderRadius:20,alignSelf:'center',marginTop:10},
  btn_text:{color:'white',textAlign:'center'},
  text_input:{},
  text:{fontSize:14, color:'black', fontWeight:'400'},
  date_select:{borderRadius:22,backgroundColor:'#1A6DBB',padding:10,margin:8},
  
  Box:{backgroundColor:'', flex:1, margin:10,marginBottom:0, borderRadius:10,alignSelf:'center'},
  Box_2:{flex:1.3, borderRadius:10,},
  Box_5:{backgroundColor:'#63B9F2', flex:2,  borderRadius:10,margin:5,padding:8},
  Box_6:{backgroundColor:'#F09C4A', flex:2, borderRadius:10,margin:5,padding:8},
  Box_7:{backgroundColor:'silver', flex:1, borderRadius:10,margin:5,padding:8},

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft:20,
    paddingRight:20,
    paddingTop:5,
    paddingBottom:5,
    borderBottomColor:'silver',
    borderBottomWidth:1,
    backgroundColor:'white'
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

const Row = StyleSheet.create({flex: 1, flexDirection: 'row'});
const Col = StyleSheet.create({flexDirection: 'column', flex: 1});
const Grid = StyleSheet.create({flexDirection:'row'});
