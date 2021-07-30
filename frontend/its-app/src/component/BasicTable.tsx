import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

type Props = {
  FirstScore: number[];
  SecondScore?: number[];
}

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 15,
    },
    body: {
      fontSize: 15,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const BasicTable: React.FC<Props> = ({ FirstScore, SecondScore }) => {
  const classes = useStyles();
  const [ar,setAr] = useState<any>([])

  useEffect(() => {
    let arr: any = []
    for (let i = 0; i < FirstScore.length; i++) {
      // console.log(FirstScore[i])

      if (SecondScore != undefined) {
        console.log("FirstScore")
        arr.push({name : i.toString(),First: FirstScore[i],Second: SecondScore[i]})
        
      } else {
        
        arr.push({name : i.toString(),First: FirstScore[i],Second: "-"})
      }
    }

    setAr(arr)
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
          <StyledTableCell align="center">ข้อสอบ (ข้อ)</StyledTableCell>
          <StyledTableCell align="center">สอบครั้งที่ 1 (คะเเนน)</StyledTableCell>
          <StyledTableCell align="center">สอบครั้งที่ 2 (คะเเนน)</StyledTableCell>
          </TableRow>
        </TableHead>
        {ar.length > 0  ?<TableBody>
           {ar.map((row:any) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell scope="row" align="center">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.First}</StyledTableCell>
              <StyledTableCell align="center">{row.Second}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>: null}
      </Table>
    </TableContainer>
  );
}
export default BasicTable