import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Facebook, SportsSoccer } from '@material-ui/icons';
import PSU from '../component/image/PSU.png'
import NBTC from '../component/image/NBTC.png'

const useStyles = makeStyles((theme) => ({
    footer: {
        // backgroundColor: theme.palette.background.paper,
        // padding: theme.spacing(3, 2),
        padding: theme.spacing(3, 2),
        marginTop: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Footer() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>

            <Box display="flex" justifyContent='space-between'>
                <Box display="flex" justifyContent="flex-start" alignItems="flex-start" flexDirection ="column">
                    <Typography variant="้h3" align="left" color="textSecondary" >
                        ติดต่อเรา <br />
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" >
                        สำนักพัฒนาทรัพยากรมนุษย์และพันธกิจสังคม <br />
                        มหาวิทยาลัยสงขลานครินทร์ <br />
                        อาคารศูนย์ทรัพยากรการเรียนรู้ อาคาร 1 <br />
                        ตำบลหาดใหญ่ อำเภอหาดใหญ่ จังหวัดสงขลา <br />
                        โทรศัพท์ : 0-7428-6972-7
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-start" alignItems="center" flexDirection ="column">
                    <Typography variant="subtitle1" align="center" color="textSecondary" >
                        Social
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" >
                        <SportsSoccer fontSize="small" /> สำนักพัฒนาทรัพยากรมนุษย์และพันธกิจสังคม <br />
                        มหาวิทยาลัยสงขลานครินทร์ <br />
                        <Facebook fontSize="small" /> สำนักพัฒนาทรัพยากรมนุษย์และพันธกิจสังคม - OMS <br />
                        <Facebook fontSize="small" /> คิดดี-คิดเป็น ประโยชน์ของเพื่อนมนุษย์เป็นกิจที่หนึ่ง<br />
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="flex-end" >
                    <img src={NBTC} alt="image_NBTC" style={{ height: 85, width: 130, marginTop: 28 }} />
                    <img src={PSU} alt="image_PSU" style={{ height: 85, width: 150, marginTop: 28 }} />
                </Box>
            </Box>

        </footer>
    )
}