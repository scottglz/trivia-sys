
import './recharts.custom.css';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label, Tooltip } from 'recharts';
import { userFull } from '@trivia-nx/users';
import { graphDatum } from '../../scorecategories';


const colors = [
   '#003f5c',
   '#2f4b7c',
   '#665191',
   '#a05195',
   '#d45087',
   '#f95d6a',
   '#ff7c43',
   '#ffa600'
];

export function ScoresGraph(props: {
   graphData: graphDatum[],
   users: userFull[]
}) {
   return ( 
      <LineChart width={1000} height={600} data={props.graphData}>
         <CartesianGrid vertical={false} stroke="#DDD" fill="#fff" />
         <XAxis dataKey="name"></XAxis>
         <YAxis></YAxis>
         {
            props.users.map((user, idx) => (
               <Line key={user.userid} name={user.username} dataKey={user.userid} dot={false} stroke={colors[idx % colors.length]} strokeWidth="3" strokeOpacity=".7"/>
            ))
         }
         <Tooltip/>
      </LineChart>
   );
}
