import React from 'react'
import { Pie } from 'react-chartjs-2';


type Props = {

    Label: string[];
    Score: number[];
    Title: string
}

const PieChart: React.FC<Props> = ({ Label, Score, Title }) => {

    const dataTotel = {

        labels: Label,
        datasets: [
            {
                data: Score,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                ],
                hoverOffset: 4

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
        <Pie type={'pie'} data={dataTotel} options={option} />
    )

}

export default PieChart