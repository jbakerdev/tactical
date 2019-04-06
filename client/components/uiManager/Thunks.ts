import { dispatch } from '../../../client/App'
const Constants = require('../../../Constants')
import WS from '../../WebsocketClient'
export const server = new WS()
import { MatchStatus } from '../../../enum'
import Maps from '../../assets/Maps'

export const onLogin = (currentUser:LocalUser, sessionId:string) => {
    dispatch({ type: Constants.ReducerActions.SET_USER, currentUser })
    server.publishMessage({type: Constants.ReducerActions.PLAYER_AVAILABLE, currentUser, sessionId})
}

export const onPlayerReady = (currentUser:Player, army:Array<Unit>, session:Session) => {
    session.players.forEach((player) => {
        if(player.id===currentUser.id){
            player.isReady = true
        } 
    })
    army.forEach(unit => {
        unit.x=(unit.x+currentUser.spawn.x)%session.map.length
        unit.y=(unit.y+currentUser.spawn.y)%session.map[0].length
        session.map[unit.x][unit.y].unit = unit
    })
    if(!session.players.find((player)=>!player.isReady)){
        session.status = MatchStatus.ACTIVE
    }
    sendSessionUpdate(session)
}

export const onMatchStart = (currentUser:LocalUser, session:Session) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE, 
        sessionId: session.sessionId,
        session: {
            status: MatchStatus.SETUP,
            activePlayerId: currentUser.id,
            players: session.players.map((player:Player, i) => {
                return {
                    ...player,
                    isReady:false,
                    spawn: Maps.CrowBridge.SpawnPoints[i]
                }
            }),
            map: Maps.CrowBridge.Map.map((row, i) => row.map((tile:Tile, j) => {return {...tile, x:i, y:j}})),
            ticks: 0,
            turnTickLimit: 100000
        }
    })
}

export const onMoveUnit = (unit:Unit, session:Session) => {
    session.map.forEach(row => row.forEach(tile => {
        if(tile.unit && tile.unit.id === unit.id) delete tile.unit
    }))
    session.map[unit.x][unit.y].unit = unit
    sendSessionUpdate(session)
}

export const onAttackTile = (attacker:Unit, tile:Tile, session:Session) => {
    const target = tile.unit
    target.hp -= attacker.atk
    attacker.move = 0
    attacker.attacks--

    session.map[attacker.x][attacker.y].unit = {...attacker}
    if(target.hp > 0)
        session.map[target.x][target.y].unit = {...target}
    else delete session.map[target.x][target.y].unit
    sendSessionUpdate(session)
}

export const onMatchTick = (session:Session) => {
    session.ticks++
    sendSessionUpdate(session)
}

export const onEndTurn = (session:Session) => {
    session.activePlayerId = session.players.find((player) => player.id !== session.activePlayerId).id
    session.ticks = 0
    sendSessionUpdate(session)
}

export const onMatchWon = (session:Session) => {
    session.status = MatchStatus.WIN
    sendSessionUpdate(session)
}

export const onMatchLost = (session:Session) => {
    session.status = MatchStatus.LOSE
    sendSessionUpdate(session)
}

export const onCleanSession = () => {
    dispatch({
        type:   Constants.ReducerActions.MATCH_CLEANUP
    })
}

const sendSessionUpdate = (session:Session) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        sessionId: session.sessionId,
        session: {
            ...session
        }
    })
}