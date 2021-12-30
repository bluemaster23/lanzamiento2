
import React, {Component , useEffect, useState  } from 'react';
import ReactDOM from 'react-dom';
import {Box , Grid, Card , Typography , Chip, CardHeader , Button, Avatar, CircularProgress } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Cookies from "js-cookie";
import {
    BrowserRouter as Router,
    Routes ,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
  import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Loader = ({msg = ''}) =>{
    return (
        <Box sx={{ display: 'flex', fontSize:'3em', flexDirection:'column', margin:'0 auto' , width: '50%', textAlign:'center' }}>
            <CircularProgress sx={{margin:'0 auto'}} />
            <Typography  variant="h1" component="h2">{msg}</Typography>
      </Box>
    )
}
const  Error = ({msg=''}) =>{
    return ( <Box sx={{ display: 'flex',  flexDirection:'column', margin:'0 auto' , width: '50%', textAlign:'center' }}>
        <Typography sx={{fontSize:'3em'}} variant="h1" component="h2">Ups!! se ha presentado un incoveniente</Typography>
        <Typography sx={{fontSize: '1.5em'}} variant="p" component="p">{msg}</Typography>
        <a href='/lanzamientos'>Regresar</a>
    </Box>);
}

  function Lanzamientos({token}){
    const [data , setData] = useState([]);
    const [page, setPage] = useState(0);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(false);
      const getData = (page) =>{
        setLoader(true);
        let token = Cookies.get('apisid');
        axios.get(`/api/getAlbum?token=${token}&page=${page}`)
        .then(function (response) {
            let datos = response.data;
            setData(data.concat(datos.data));
            setPage(datos.page);
           setLoader(false);
        })
        .catch(function (error) {
            setError(true);
            setLoader(false);

        });
    }

    useEffect(() => {
        getData(0);     
    }, []);



    if(error){
        return (<Error msg={"No se ha podido acceder a la información"} /> )
    }
    
    
      return (
          <Box sx={{padding: '2em'}}>
              <Grid container spacing={2}>
                  {data.map(res=>{
                      return (
                            <Grid item md={4} xl={4} sm={6}>
                                <Card>
                                    <CardMedia 
                                        component="img"
                                        height={res.images[1]["height"]}
                                        image={res.images[1]["url"]}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">{res.name}</Typography>
                                        <Typography variant="body2" >
                                            {res.artists.map(res2=>{
                                                return (<Link  to={`/artista/${res2.id}`}> <Chip label={res.name} /></Link>)
                                            })}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid> )
                  })}
                   <Grid item md={2}>
                        {(loader) ?  <Loader  /> : 
                        (page < 5) ?
                        <Button onClick={()=>{ getData(page)}} >Ver más</Button>
                        : <p>No se encuentran mas datos</p>
                        }
                     </Grid>
                   
              </Grid>
          </Box>
      )

  }

  function Artista(){
    let { id } = useParams();
    const [info , setInfo] = useState([]);
    const [top , setTop] = useState([]);
    const [loader, setLoader] = useState(true);
    const [error, setError] =  useState(false);
      const getData = (page) =>{
        setLoader(true);
        let token = Cookies.get('apisid');
        axios.get(`/api/getArtista?token=${token}&id=${id}`)
        .then(function (response) {
            let data = response.data.data;

            setInfo(data.artista);
            setTop(data.top);
           setLoader(false);
        })
        .catch(function (error) {
            setError(true);
            setLoader(false);

        });
    }

    useEffect(() => {
        getData(0);     
    }, []);

    if(loader){
        return <Loader msg={'Cargando la información del artista , espere un momento'} />
    }
    if(error){
        return <Error msg={"La información del artista no se encontró"} /> 
    }
    return (
        <Box sx={{padding: '2em'}}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <Card>
                        <CardHeader avatar={
                            <Avatar alt="Remy Sharp" src={info.images[2]['url']} />
                        }
                            title={info.name}
                            subheader={<a target='__blank' href={info["external_urls"]["spotify"]}>Ir a página del artista</a>}
                        />
                    </Card>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Foto</TableCell>
                            <TableCell align="left">Album</TableCell>
                            <TableCell align="left">Canción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {top.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row"><img src={row['album']['images'][2]['url'] } /></TableCell>
                        <TableCell align="left">{row.album.name}</TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
  }

 function App() {
   const [loader, setLoader] = useState(true);
    const [error , setError] = useState(false);
    const getToken =  ()=>{
        setLoader(true);
        axios.post('/api/getToken')
        .then(function (response) {
           let data=  response.data.token;
           Cookies.set('apisid', data.token, { expires:  Math.floor((data.time) -15 / (3600*24)) })
           setLoader(false);
        })
        .catch(function (error) {
            setError(true);
            setLoader(false);
        })      
    }
     useEffect(()=>{
        getToken();
     }, []);
     if(loader){
        return (<Loader />)
     }
     if(error){
        return <Error  msg={"No se puede acceder al sistema, por favor ingrese más tarde"}/>
     }
    return (
      <Router>
          <Routes >
            <Route exact path="/" element={<Lanzamientos token={getToken} />}  />
            <Route exact path="/lanzamientos" element={<Lanzamientos token={getToken} />}  />
            <Route path="/artista/:id" element={<Artista token={getToken} />} />
          </Routes >
      </Router>
    );
  }

ReactDOM.render(<App/>, document.getElementById('content'));