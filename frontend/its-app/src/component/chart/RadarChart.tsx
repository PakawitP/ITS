import React from 'react'
import { Radar } from 'react-chartjs-2';


type Props = {

    // Label: string[];
    // Score: number[];
    // Lable: string
    // Title: string

    Label: string[];
    FirstScore: number[];
    SecondScore: number[];
    FirstLable: string
    SecondLable: string
    Title: string
}

const RadarChart: React.FC<Props> = ({ Label, FirstScore, SecondScore, FirstLable, SecondLable, Title }) => {

    const dataTotel = {

        labels: Label,
        datasets: [
            {
                label: FirstLable,
                data: FirstScore,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'

            },
            {
                label: SecondLable,
                data: SecondScore,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'

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
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 100,
                
            }
        },
 

    }

    return (
        <Radar type={'radar'} data={dataTotel} options={option} />
    )

}

export default RadarChart