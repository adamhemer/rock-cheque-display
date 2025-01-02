import React from "react";
import "./index.css";
import Category from "./Category";
import Player from "./Player";
import axios from "axios";

const STATES = {
    SETUP: 0,       // Asigning players to buzzers, choosing colours, etc
    DEMO: 1,        // Let players try out the remotes
    SELECTION: 2,   // On the category board
    WAITING: 3,     // Question shown but players cant buzz yet
    ARMED: 4,       // Players can buzz in
    BUZZED: 5,      // A player has buzzed in
    ANSWERED: 6,    // The question has been answered correctly, show answer
    TIEBREAK: 7,    // Extra question for tiebreaking
    GAMEOVER: 8     // All questions are complete, show final scores
}

const MEDIA_STATES = {
    INITIAL: 0,
    PLAY_QUESTION: 1,
    PLAY_ANSWER: 2,
}

const TYPES = {
    TEXT: "Text",
    IMAGE: "Image",
    VIDEO: "Video",
    AUDIO: "Audio"
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            showQuestion: false,
            activeQuestion: {},
            showGrid: true,
            mediaState: MEDIA_STATES.INITIAL
        };

        this.serverAddress = "http://127.0.0.1:8000/";
        this.server = axios.create({
            baseURL: this.serverAddress,
            timeout: 1000
        })

        this.colours = [
            "#5bc0ebff",
            "#c3423fff",
            "#eae151ff",
            "#404e4dff",
            "#558564ff",
            "#ff88dcff",
            "#6622ccff"
        ]
    }

    componentDidMount() {
        this.fetchData();

        // console.log(this.server.get("/public/epicbreach.mp4"))
    }

    componentWillUnmount() {
        if (this.fetchTimeout) {
            clearTimeout(this.fetchTimeout);
        }
    }

    fetchData = () => {
        this.server.get('board-data')
            .then(res => {
                // console.log(res);
                this.setState({ board: res.data }, () => {
                    this.fetchState();
                    // console.log("State:");
                    // console.log(this.state.showQuestion);
                    // console.log(this.state.activeQuestion.type);
                    if (this.state.showQuestion && (this.state.gameState.activeQuestion.type === TYPES.VIDEO || this.state.gameState.activeQuestion.type === TYPES.AUDIO)) {
                        this.fetchMediaState();
                    }
                    this.refreshCategories();
                });
            });
    }

    fetchState = () => {
        this.server.get('game-state')
            .then(res => {
                // console.log(res);

                this.setState({ gameState: res.data }, () => {
                    if (this.state.gameState.state >= STATES.WAITING && this.state.gameState.state <= STATES.ANSWERED) {
                        console.log("Question")

                        this.setState({
                            showQuestion: true,
                            // activeQuestion: this.state.gameState.activeQuestion,
                            // activeCategory: this.state.gameState.activeCategory,
                            showGrid: false
                        });

                        console.log(this.state.gameState);
                    } else {
                        this.setState({ showQuestion: false, showGrid: true });
                    }

                });

                this.fetchTimeout = setTimeout(this.fetchData, 1000)

            });
    }

    fetchMediaState = () => {
        console.log("get media state");
        this.server.get('media-state')
            .then(res => {
                console.log(res.data);
                if (res.data !== this.state.mediaState) {
                    this.setState({ mediaState: res.data }, () => {
                        console.log(this.state.mediaState);
                        switch (this.state.mediaState) {
                            case (MEDIA_STATES.INITIAL):
                                if (this.state.gameState.activeQuestion.type === TYPES.VIDEO) {
                                    const vid = document.getElementsByTagName("video")[0];
                                    vid.currentTime = this.state.gameState.activeQuestion.playFrom;
                                    
                                } else if (this.state.gameState.activeQuestion.type === TYPES.AUDIO) {
                                    
                                }
                                break;

                            case (MEDIA_STATES.PLAY_QUESTION):
                                if (this.state.gameState.activeQuestion.type === TYPES.VIDEO) {
                                    const vid = document.getElementsByTagName("video")[0];
                                    vid.currentTime = this.state.gameState.activeQuestion.playFrom;
                                    const duration = 1000 * (this.state.gameState.activeQuestion.playTo - this.state.gameState.activeQuestion.playFrom);
                                    setTimeout(() => {
                                        vid.pause();
                                    }, duration)
                                    vid.play();
                                } else if (this.state.gameState.activeQuestion.type === TYPES.AUDIO) {
                                    
                                }
                                break;

                            case (MEDIA_STATES.PLAY_ANSWER):
                                if (this.state.gameState.activeQuestion.type === TYPES.VIDEO) {
                                    const vid = document.getElementsByTagName("video")[0];
                                    vid.play();
                                } else if (this.state.gameState.activeQuestion.type === TYPES.AUDIO) {
                                    
                                }
                                break;

                            default:
                                break;
                        }
                    });
                }
            });
    }

    refreshCategories() {
        let catObj = [];

        this.state.board.forEach((cat, i) => {
            catObj.push(<Category key={i} name={cat.title} questions={cat.questions} backgroundColour={this.colours[i]} ></Category>);
        });

        this.setState({ categoriesObj: catObj });

    }

    playerFooter() {
        if (!this.state.gameState) { return; }
        return (
        <div className="PlayerFooter">
            {this.state.gameState.players.map(p => <Player key={p.name} name={p.name} score={p.points}></Player>)}
        </div>)
    }

    questionCategoryHeader() {
        if (!this.state.gameState || !this.state.gameState.activeCategory || !this.state.showQuestion) { return; }
        return (
            <div className="QuestionCategoryHeaderText">
                <p>{this.state.gameState.activeCategory.title} - {this.state.gameState.activeQuestion.reward}</p>
            </div>
        )
    }

    questionContentTitle() {
        if (!this.state.gameState || !this.state.gameState.activeCategory || !this.state.showQuestion) { return; }
        return (
            <p className="QuestionContentTitle">{this.state.gameState.activeQuestion.title}</p>
        )
    }

    answerDisplay() {
        if (!this.state.gameState || !this.state.gameState.activeQuestion) { return; }
        return (
            <div style={{ display: (this.state.gameState.state === STATES.ANSWERED && this.state.gameState.activeQuestion.answer) ? "block" : "none" }}>
                <p className="QuestionContentAnswer">Answer: {this.state.gameState.activeQuestion.answer}</p>
            </div>
        )
    }

    displayImageQuestion() {
        if (!this.state.gameState || !this.state.gameState.activeQuestion) { return; }
        return (
            <div style={{ display: this.state.gameState.activeQuestion.type === TYPES.IMAGE ? "block" : "none" }}>
            </div>
        )
    }

    displayAudioQuestion() {
        if (!this.state.gameState || !this.state.gameState.activeQuestion) { return; }
        return (
            <div style={{ display: this.state.gameState.activeQuestion.type === TYPES.AUDIO ? "block" : "none" }}>
            </div>
        )
    }

    displayVideoQuestion() {
        if (!this.state.gameState || !this.state.gameState.activeQuestion) { return; }
        return (
            <div class="VideoContainer" style={{ display: this.state.gameState.activeQuestion.type === TYPES.VIDEO ? "block" : "none" }}>
                <video className="Video">
                    <source src={this.state.gameState.activeQuestion.src} type="video/mp4"></source>
                </video>
            </div>
        )
    }

    render() {
        return (
            <div className="App">
                {this.questionCategoryHeader()}
                
                <div
                    className="FlexContainer QuestionDisplay"
                    style={{ display: this.state.showQuestion ? "flex" : "none" }}
                >

                    <div className="QuestionContent">
                        {this.questionContentTitle()}

                        {this.displayImageQuestion()}
                        {this.displayAudioQuestion()}
                        {this.displayVideoQuestion()}

                        {this.answerDisplay()}
                    </div>
                </div>
                <div className="FlexContainer QuestionGrid" style={{ display: this.state.showGrid ? "flex" : "none" }}>

                    {this.state.categoriesObj}

                    {/* <Category
                        name="Cat1"
                        questionCount="4"
                        backgroundColour="var(--aero)"
                    ></Category>
                    <Category
                        name="Test"
                        questionCount="3"
                        backgroundColour="var(--persian-red)"
                    ></Category>
                    <Category
                        name="Animals"
                        questionCount="5"
                        backgroundColour="var(--maize)"
                    ></Category>
                    <Category
                        name="Famous quotes"
                        questionCount="7"
                        backgroundColour="var(--persian-pink)"
                    ></Category>
                    <Category
                        name="The big boyz"
                        questionCount="3"
                        backgroundColour="var(--french-violet)"
                    ></Category> */}
                    {/* <Category name="The big boyz"   questions={[{ type: "Video",  question: "What is this?", pointValue: 100, source: "epicbreach.mp4" }, { type: "Text", pointValue: 1000, question: "I don't know" }]} backgroundColour="var(--french-violet)"></Category> */}
                </div>
                {this.playerFooter()}
                {/* <div className="PlayerFooter">
                    <Player name="Adam" score="100"></Player>
                    <Player name="Callum" score="100"></Player>
                    <Player name="Emily" score="100"></Player>
                    <Player name="Koni" score="100"></Player>
                    <Player name="Hayley" score="100"></Player>
                    <Player name="Lauren" score="100"></Player>
                    <Player name="James" score="100"></Player>
                    <Player name="Beth" score="100"></Player>
                </div> */}
            </div>
        );
    }
}

export default App;
