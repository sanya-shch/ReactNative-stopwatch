import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import moment from 'moment';

function Timer({ interval, style }) {
    const pad = (n) => n < 10 ? '0' + n : n;
    const duration = moment.duration(interval);
    return (
        <View style={styles.timerContainer}>
            <Text style={style}>{pad(duration.minutes())}:</Text>
            <Text style={style}>{pad(duration.seconds())}.</Text>
            <Text style={style}>{pad(Math.floor(duration.milliseconds()/10))}</Text>
        </View>
    )
}

function Btn({ title, color, background, onPress, disabled }) {
    return(
        <TouchableOpacity
            style={[styles.btn,{backgroundColor: background}]}
            onPress={() => !disabled && onPress()}
            activeOpacity={disabled ? 1.0 : 0.7}
        >
            <View style={styles.btnBorder}>
                <Text style={[styles.btnTitle,{color}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

function BtnRow({ children }) {
    return(
        <View style={styles.btnRow}>{children}</View>
    )
}

function Lap({ number, interval/*, fastest, slowest*/ }) {
    const lapStyle = [
        styles.lapText,
        // fastest && styles.fastest,
        // slowest && styles.slowest
    ];
    return(
        <View style={styles.lap}>
            <Text style={lapStyle}>#{number} </Text>
            <Timer style={[lapStyle, styles.lapTimer]} interval={interval}/>
        </View>
    )
}

function LapsTable({ laps, timer }) {
    // const finishedLaps = laps.slice(1);
    // let min = Number.MAX_SAFE_INTEGER;
    // let max = Number.MIN_SAFE_INTEGER;
    // if (finishedLaps.length >= 2) {
    //     finishedLaps.forEach(lap => {
    //         if (lap < min) min = lap;
    //         if (lap > max) max = lap;
    //     })
    // }
    return(
        <ScrollView style={styles.scrollView}>
            {laps.map((lap, id) => (
                <Lap
                    number={laps.length-id}
                    key={laps.length-id}
                    interval={id === 0 ? timer + lap : lap}
                    // slowest={lap === min}
                    // fastest={lap === max}
                />
            ))}
        </ScrollView>
    )
}
export default class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            laps: [],
            start: 0,
            now: 0
        };
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    start = () => {
        const now = new Date().getTime();
        this.setState({
            start: now,
            now,
            laps: [0]
        });
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime()})
        }, 100)
    };

    lap = () => {
        const timestamp = new Date().getTime();
        const { laps, now, start } = this.state;
        const [firstLap, ...other] = laps;
        this.setState({
            laps: [0, firstLap + now - start, ...other],
            start:timestamp,
            now: timestamp
        })
    };

    stop = () => {
        clearInterval(this.timer);
        const { laps, now, start } = this.state;
        const [firstLap, ...other] = laps;
        this.setState({
            laps: [firstLap + now - start, ...other],
            start: 0,
            now: 0
        })
    };

    reset = () => {
        this.setState({
            laps: [],
            start: 0,
            now: 0
        })
    };

    resume = () => {
        const now = new Date().getTime();
        this.setState({
            start: now,
            now
        });
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime()})
        }, 100)
    };

    render() {
        const { now, start, laps } = this.state;
        const timer = now - start;
        return (
            <View style={styles.container}>
                <Timer
                    interval={laps.reduce((total, curr) => total + curr, 0) + timer}
                    style={styles.timer}
                />
                {laps.length === 0 && (
                    <BtnRow>
                        <Btn
                            title='Reset'
                            color='#ffffff'
                            background='#212121'
                            disabled
                        />
                        <Btn
                            title='Start'
                            color='#0a421d'
                            background='#1de25f'
                            onPress={this.start}
                        />
                    </BtnRow>
                )}
                {start > 0 && (
                    <BtnRow>
                        <Btn
                            title='Lap'
                            color='#ffffff'
                            background='#3d3d3d'
                            onPress={this.lap}
                        />
                        <Btn
                            title='Stop'
                            color='#421818'
                            background='#ef6e6e'
                            onPress={this.stop}
                        />
                    </BtnRow>
                )}
                {laps.length > 0 && start === 0 && (
                    <BtnRow>
                        <Btn
                            title='Reset'
                            color='#ffffff'
                            background='#3d3d3d'
                            onPress={this.reset}
                        />
                        <Btn
                            title='Start'
                            color='#0a421d'
                            background='#1de25f'
                            onPress={this.resume}
                        />
                    </BtnRow>
                )}
                <LapsTable laps={laps} timer={timer}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        // justifyContent: 'center'
        paddingTop: 130,
        paddingHorizontal: 30
    },
    timer: {
        color: "white",
        fontSize: 76,
        // fontWeight: '200'
        width: 110,
    },
    btn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        fontSize: 15
    },
    btnBorder: {
        width: 75,
        height: 75,
        borderRadius: 38,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginTop: 80,
        marginBottom: 30
    },
    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#151515',
        borderTopWidth: 1,
        paddingVertical: 5
    },
    lapText: {
        color: 'white',
        fontSize: 20
    },
    scrollView: {
        alignSelf: 'stretch'
    },
    // fastest: {
    //     color: '#48c05f'
    // },
    // slowest: {
    //     color: '#cc3530'
    // },
    timerContainer: {
        flexDirection: 'row'
    },
    lapTimer: {
        width: 30,
    }
});
