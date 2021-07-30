import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { RountAdmin, RountUsers } from '../../services/rountURL'
import {
  PostAddSharp,
  AddToPhotos,
  ControlPointDuplicate,
  CollectionsBookmark,
  Ballot,
  EventNote,
  AddBox,
  ListAlt
} from '@material-ui/icons';
import { Link } from "react-router-dom";



export const mainListItems = (
  <div>
    <ListSubheader inset>
      โรงเรียน
    </ListSubheader>

    <ListItem button component={Link} to={RountUsers.ShowSchool} >
      <ListItemIcon>
        <CollectionsBookmark color="primary" />
      </ListItemIcon>
      <ListItemText primary="แก้ไขโรงเรียน" />
    </ListItem>

    <ListItem button component={Link} to={RountAdmin.AddSchool} >
      <ListItemIcon>
        <AddBox color="primary" />
      </ListItemIcon >
      <ListItemText primary="เพิ่มโรงเรียน" />
    </ListItem>
    
  </div>
);

export const secondaryListItems = (

  <div>
    <ListSubheader inset>
      ข้อสอบ
    </ListSubheader>

    <ListItem button component={Link} to={RountAdmin.ShowExam} >
      <ListItemIcon>
        <EventNote color="primary" />
      </ListItemIcon>
      <ListItemText primary="แก้ไขข้อสอบ" />
    </ListItem>
    <ListItem button component={Link} to={RountAdmin.AddExam} >
      <ListItemIcon>
        <PostAddSharp color="primary" />
      </ListItemIcon>
      <ListItemText primary="เพิ่มข้อสอบ" />
    </ListItem>

    <ListItem button component={Link} to={RountAdmin.ShowSkill} >
      <ListItemIcon>
        <Ballot color="primary" />
      </ListItemIcon>
      <ListItemText primary="แก้ไขทักษะ" />
    </ListItem>
    <ListItem button component={Link} to={RountAdmin.AddSkill} >
      <ListItemIcon>
        <AddToPhotos color="primary" />
      </ListItemIcon >
      <ListItemText primary="เพิ่มทักษะ" />
    </ListItem>

    <ListItem button component={Link} to={RountAdmin.ShowQuizSet} >
      <ListItemIcon>
        <ListAlt color="primary" />
      </ListItemIcon>
      <ListItemText primary="แก้ไขชุดข้อสอบ" />
    </ListItem>
    <ListItem button component={Link} to={RountAdmin.AddQuizSet} >
      <ListItemIcon>
        <ControlPointDuplicate color="primary" />
      </ListItemIcon >
      <ListItemText primary="เพิ่มชุดข้อสอบ" />
    </ListItem>
    
  </div>  
);

// export const thirdListItems = (

//   <div>
//     <ListSubheader inset>
//       โหมดทดสอบ
//     </ListSubheader>

//     <ListItem button component={Link} to={RountAdmin.ShowExam} >
//       <ListItemIcon>
//         <EventNote color="primary" />
//       </ListItemIcon>
//       <ListItemText primary="แก้ไขข้อทดสอบ" />
//     </ListItem>
//     <ListItem button component={Link} to={RountAdmin.AddExam} >
//       <ListItemIcon>
//         <PostAddSharp color="primary" />
//       </ListItemIcon>
//       <ListItemText primary="เพิ่มข้อทดสอบ" />
//     </ListItem>
    
//   </div>  
// );
