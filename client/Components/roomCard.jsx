import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 300,
    maxWidth: '100%',
    maxHeight:'100%',
  },
});

export default function RoomCard(props) {
  const {
    imageUrl,
    imageTitle,
    descriptionTitle,
    descriptionBody,
    roomAddress,
    roomAddress2} = props.room;
  
  const classes = useStyles();

  // console.log(roomAddress);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`/images/show/${imageUrl}`} 
          // image={imageUrl}
          title={imageTitle}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {descriptionTitle}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
           {descriptionBody}
          </Typography>
          <Typography color="textSecondary" component="p">
            {roomAddress}
            {roomAddress2}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          RESERVE
        </Button>
      </CardActions>
    </Card>
  );
}
