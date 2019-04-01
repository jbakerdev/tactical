declare enum UnitType {
    REGULAR='REGULAR',
    IMMORTAL='IMMORTAL',
    MARKSMAN='MARKSMAN',
    ALCHEMIST='ALCHEMIST',
    RISEN='RISEN',
    WISP='WISP',
    GARGANTUAN='GARGANTUAN',
    GOUL='GOUL'
}
declare enum Directions {LEFT='LEFT', RIGHT='RIGHT', UP='UP', DOWN='DOWN'}
declare enum Abilities {CHARGE='CHARGE'}
declare enum Traits {BLOCK='BLOCK', FLOAT='FLOAT', WATERBREATH='WATERBREATH'}

declare enum MatchStatus {ACTIVE='ACTIVE',WIN='WIN',LOSE='LOSE', SETUP='SETUP'}

declare enum TileType {
    MOUNTAIN='MOUNTAIN',
    FOREST='FOREST',
    RIVER='RIVER',
    HILL='HILL',
    GRASS='GRASS'
}
declare module "*.jpg" {
    const value: any;
    export = value;
}
interface LocalUser {
    name:string
    id:string
}

interface Unit {
    id:string
    x:number
    y:number
    atk: number
    hp: number
    maxHp: number
    move: number
    maxMove: number
    type: UnitType
    rune: string
    descriptions: Array<string>
    ability: Abilities
    trait: Traits
    cost: number
    level: number
}

interface Player {
    name: string
    id: string
    units: Array<Unit>
    isReady: boolean
}

interface Tile {
    x: number
    y: number
    type: TileType
    subType: string
}

interface Session {
    sessionId: string,
    status: MatchStatus,
    activePlayerId: string,
    players: Array<Player>,
    map: Array<Array<Tile>>,
    ticks: number,
    turnTickLimit: number
}

interface RState {
    isConnected: boolean
    currentUser: LocalUser
    activeSession: Session
}