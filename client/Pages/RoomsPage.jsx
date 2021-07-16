import React, { useEffect, useState } from 'react';
import MenuDrawer from '../Components/menuDrawer';
import {
  makeStyles,
  Button,
  Collapse,
  TextField,
  Typography,
} from '@material-ui/core';
import HostToiletCard from '../Components/HostToiletCard';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
const axios = require('axios');

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px 10px 20px',
  },
  cancelButton: {
    color: 'red',
  },
  newRoomForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '600px',
    width: '400px',
  },
  roomsTitle: {
    color: '#FE6B8B',
    fontSize: 60,
  },
});

const theme = createTheme({
  typography: {
    fontFamily: ['Permanent Marker', 'cursive'].join(','),
  },
});

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('description', description);

  const result = await axios.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
}

export default function RoomsPage() {
  const classes = useStyles();

  const [roomArray, setRoomArray] = useState([]);
  const [dataFromFetch, setDataFromFetch] = useState([]);

  const [addingNewRoom, setAddingNewRoom] = useState(false);

  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('');
  const [newRoomAddress, setNewRoomAddress] = useState('');
  const [newRoomZip, setNewRoomZip] = useState('');
  const [newRoomImg, setNewRoomImg] = useState('');
  const [newKey, setNewKey] = useState('');
  const [file, setFile] = useState();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const arrayOfComponents = [];

  async function submit(event) {
    const result = await postImage({ image: file, description });
    setImages([result.image, ...images]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(event);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  //this is the hook solution to lifecycle methods. This is will invoke when the HostPage component mounts
  useEffect(() => {
    console.log('You mounted!');
    //fetch all rooms
    //cookie should be sent with request...right?
    fetch('/users/check')  // <-- NICE this fixed the id issue?
      .then((data) => data.json())
      .then((data) => setNewKey(data.id))
      .then(() => fetchRooms());
  }, []);

  useEffect(() => {
    //handle new bathrooms added to array in this rerender
    //create component for each bathroom to be rendered
    dataFromFetch.forEach((room) => {
      arrayOfComponents.push(
        <HostToiletCard
          handleDeleteRoom={handleDeleteRoom}
          handleUpdateRoom={handleUpdateRoom}
          key={newKey}
          {...room}
        />
      );
    });

    setRoomArray([arrayOfComponents]);
  }, [dataFromFetch]);

  // useEffect( (() => null), [bathroomArray])
  const fetchRooms = function () {
    // fetch("/mongo/getBathrooms")
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log(response)
    //     setDataFromFetch(response)});

    axios
      .get('/rooms/getroom')
      .then((res) => res.data)
      .then((data) => setDataFromFetch(data));

    //.then(data=>data.json())
    //.then(data=>setDataFromFetch(data));
  };

  const handleDeleteRoom = function (bathroomId) {
    //delete room using mongo ID. Accessible like this:
    const id = res.locals.token.id;
    const deleteId = id;

    fetch('/rooms/deleteroom', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    })
      .then((response) => response.json())
      .then((response) => fetchRooms())
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdateRoom = function (roomProps) {
    //delete room using mongo ID. Accessible like this:
    const {
      id,
      title: updatedRoomTitle,
      description: updatedRoomDescription,
      address: updatedRoomAddress,
      price: updatedRoomPrice,
      imageFileName: updatedRoomImg,
    } = roomProps;
    const update = {
      id,
      title: updatedRoomTitle,
      description: updatedRoomDescription,
      address: updatedRoomAddress,
      price: updatedRoomPrice,
      imageFileName: updatedRoomImg,
    };

    fetch('/rooms/updateroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Update Success:', data);
      })
      .then((data) => fetchRooms())
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const addRoomHandler = function () {
    const newRoom = {
      title: newRoomTitle,
      description: newRoomDescription,
      address: newRoomAddress,
      zipcode: newRoomZip,
      imageFileName: newRoomImg,
      price: newRoomPrice,
    };

    fetch('/rooms/addroom', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoom),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newData = [...dataFromFetch];
        newData.unshift(data);
        setDataFromFetch(newData);
      })
      .catch((error) => {
        console.log('something broke here');

        console.error('Error:', error);
      });

    setNewRoomTitle('');
    setNewRoomDescription('');
    setNewRoomPrice('');
    setNewRoomZip('');
    setNewRoomAddress('');
    setNewRoomImg('');

    setAddingNewRoom(!addingNewRoom);
  };

  return (
    <div className={classes.container}>
      <MenuDrawer />
      <Collapse in={!addingNewRoom}>
        <Button
          className={classes.addButton}
          onClick={() => setAddingNewRoom(!addingNewRoom)}
        >
          Add a Room +
        </Button>
      </Collapse>
      <Collapse in={addingNewRoom}>
        <div className={classes.newRoomForm}>
          <TextField
            label='Title'
            onChange={(e) => setNewRoomTitle(e.target.value)}
          />
          <TextField
            label='Description'
            multiline
            onChange={(e) => setNewRoomDescription(e.target.value)}
          />
          <TextField
            label='Price Per Hour'
            onChange={(e) => setNewRoomPrice(e.target.value)}
          />
          <TextField
            label="Room's Street Address, City, and State"
            onChange={(e) => setNewRoomAddress(e.target.value)}
          />
          <TextField
            label="Room's Zip Code"
            onChange={(e) => setNewRoomZip(e.target.value)}
          />
          {/* <TextField
            label="Image URL"
            onChange={(e) => setNewRoomImg(e.target.value)}
          /> */}
          <div className='Uploadpage'>
            <form onSubmit={handleSubmit}>
              <input
                onChange={fileSelected}
                type='file'
                accept='image/*'
              ></input>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type='text'
              ></input>
              <button type='submit'>Submit</button>
            </form>

            {images.map((image) => (
              <div key={image}>
                <img src={image}></img>
              </div>
            ))}
          </div>
          <Button className={classes.addButton} onClick={addRoomHandler}>
            Submit
          </Button>
          <Button
            className={classes.cancelButton}
            onClick={() => {
              setAddingNewRoom(!addingNewRoom);
            }}
          >
            Cancel
          </Button>
        </div>
      </Collapse>
      <h2 className={classes.roomsTitle}>Your Rooms</h2>

      <div className={classes.cardContainer}>
        {roomArray
          ? roomArray
          : "Rooms you're listing or renting will appear here!"}
      </div>
    </div>
  );
}
