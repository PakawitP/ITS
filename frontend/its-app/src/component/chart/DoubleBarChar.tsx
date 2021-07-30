import React from 'react'
import { Bar } from 'react-chartjs-2';


type Props = {

    Label: string[];
    FirstScore: number[];
    SecondScore: number[];
    FirstLable: string
    SecondLable: string
    Title: string
}

const DoubleBarChar: React.FC<Props> = ({ Label, FirstScore, SecondScore, FirstLable, SecondLable, Title }) => {

    const dataTotel = {

        labels: Label,

        datasets: [
            {
                label: FirstLable,
                data: FirstScore,
                fill: true,
                backgroundColor: "rgba(51, 102, 255,0.4)",
                borderColor: "rgba(51, 102, 255,1)"
            },
            {
                label: SecondLable,
                data: SecondScore,
                fill: true,
                backgroundColor: "rgba(255, 51, 133,0.4)",
                borderColor: "rgba(255, 51, 133,1)",

            },


        ]

    };

    const option = {
       
        plugins: {
            title: {
                display: true,
                text: Title,
                font: {
                    size: 16,

                }
            },
            legend: {
                position: 'bottom',
                labels: {

                    // This more specific font property overrides the global property
                    font: {
                        size: 14
                    }
                }
            }
        },
    
    }



    return (
        <Bar type={'bar'} data={dataTotel} options={option} />
    )

}

export default DoubleBarChar