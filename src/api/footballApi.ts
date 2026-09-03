const BASE_URL="https://site.api.espn.com/apis/site/v2/sports/soccer";

export type ApiTeam={
  id?:string;
  displayName:string;
  shortDisplayName?:string;
  abbreviation?:string;
  logo?:string;
};

export type ApiCompetitor={
  id?:string;
  homeAway:"home"|"away";
  score?:string;
  team:ApiTeam;
};

export type ApiCompetition={
  id?:string;
  date?:string;
  competitors:ApiCompetitor[];
  status?:{
    type?:{
      id?:string;
      name?:string;
      state?:string;
      completed?:boolean;
      description?:string;
      detail?:string;
      shortDetail?:string;
    }
  };
  venue?:{fullName?:string};
};

export type ApiLeague={
  id?:string;
  name?:string;
  abbreviation?:string;
  logo?:string;
};

export type ApiEvent={
  id:string;
  name:string;
  date:string;
  competitions?:ApiCompetition[];
  league?:ApiLeague;
  season?:{name?:string;year?:number};
};

export type MatchPlay={
  id?:string;
  text?:string;
  shortText?:string;
  type?:{text?:string;abbreviation?:string};
  clock?:{displayValue?:string};
  period?:{number?:number};
  homeScore?:string;
  awayScore?:string;
  scoringPlay?:boolean;
  team?:{id?:string;displayName?:string;logo?:string};
};

export type MatchStatistic={
  name?:string;
  displayName?:string;
  home?:string;
  away?:string;
};

export type MatchLeader={
  name?:string;
  displayName?:string;
  shortDisplayName?:string;
  value?:string|number;
  athlete?:{
    displayName?:string;
    shortName?:string;
    headshot?:{href?:string};
  };
};

export type MatchDetails={
  event:ApiEvent;
  plays:MatchPlay[];
  statistics:MatchStatistic[];
  leaders:MatchLeader[];
  venue?:string;
  attendance?:number;
};

export const LEAGUES={
  premierLeague:"eng.1",
  laLiga:"esp.1",
  serieA:"ita.1",
  bundesliga:"ger.1",
  ligue1:"fra.1",
  eredivisie:"ned.1",
  primeiraLiga:"por.1",
  superLig:"tur.1",
  championsLeague:"uefa.champions",
  europaLeague:"uefa.europa",
  egyptianLeague:"egy.1",
  saudiLeague:"ksa.1",
  mls:"usa.1"
} as const;

export const ALL_LEAGUES=[
  ["eng.1","الدوري الإنجليزي الممتاز"],
  ["esp.1","الدوري الإسباني"],
  ["ita.1","الدوري الإيطالي"],
  ["ger.1","الدوري الألماني"],
  ["fra.1","الدوري الفرنسي"],
  ["ned.1","الدوري الهولندي"],
  ["por.1","الدوري البرتغالي"],
  ["tur.1","الدوري التركي"],
  ["uefa.champions","دوري أبطال أوروبا"],
  ["uefa.europa","الدوري الأوروبي"],
  ["usa.1","الدوري الأمريكي"],
  ["ksa.1","الدوري السعودي"],
  ["egy.1","الدوري المصري"]
].map(([id,name])=>({id,name}));

const dateKey=(date=new Date())=>{
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,"0");
  const d=String(date.getDate()).padStart(2,"0");
  return`${y}${m}${d}`;
};

const offsetDate=(n:number)=>{
  const d=new Date();
  d.setDate(d.getDate()+n);
  return dateKey(d);
};

const leagueName=(id:string)=>
  ALL_LEAGUES.find(x=>x.id===id)?.name||"Football";

const statusState=(status:any)=>{
  const type=status?.type;

  if(type?.state)return type.state;

  const name=String(type?.name||"").toLowerCase();

  if(name.includes("live")||name.includes("progress"))
    return"in";

  if(type?.completed||name.includes("final"))
    return"post";

  return"pre";
};

/* =========================
   TEAM LOGO
========================= */

const getTeamLogo=(team:any)=>{
  return(
    team?.logo||
    team?.logos?.[0]?.href||
    team?.logos?.[0]?.url||
    team?.team?.logo||
    team?.team?.logos?.[0]?.href||
    team?.team?.logos?.[0]?.url||
    ""
  );
};

const makeTeam=(x:any,side:string):ApiTeam=>({
  id:x?.team?.id
    ?String(x.team.id)
    :x?.id
    ?String(x.id)
    :undefined,

  displayName:
    x?.team?.displayName||
    x?.team?.name||
    x?.displayName||
    x?.name||
    side,

  shortDisplayName:
    x?.team?.shortDisplayName||
    x?.team?.displayName||
    x?.displayName||
    side,

  abbreviation:
    x?.team?.abbreviation||
    x?.abbreviation||
    side.toUpperCase(),

  logo:getTeamLogo(x)
});

const normalize=(event:any,leagueId:string):ApiEvent=>{
  const comp=event?.competitions?.[0];

  const teams=comp?.competitors||[];

  const home=teams.find((x:any)=>x.homeAway==="home");
  const away=teams.find((x:any)=>x.homeAway==="away");

  const date=
    event?.date||
    comp?.date||
    new Date().toISOString();

  const state=statusState(comp?.status);

  const h=makeTeam(home,"Home");
  const a=makeTeam(away,"Away");

  return{
    id:String(event?.id||""),
    name:
      event?.name||
      `${h.displayName} vs ${a.displayName}`,
    date,

    competitions:[{
      id:String(comp?.id||event?.id||""),
      date,

      competitors:[
        {
          id:home?.id
            ?String(home.id)
            :h.id,

          homeAway:"home",

          score:
            home?.score!=null
              ?String(home.score)
              :undefined,

          team:h
        },

        {
          id:away?.id
            ?String(away.id)
            :a.id,

          homeAway:"away",

          score:
            away?.score!=null
              ?String(away.score)
              :undefined,

          team:a
        }
      ],

      status:{
        type:{
          id:comp?.status?.type?.id||"",
          name:comp?.status?.type?.name||"",
          state,
          completed:Boolean(
            comp?.status?.type?.completed
          ),
          description:
            comp?.status?.type?.description||"",
          detail:
            comp?.status?.type?.detail||"",
          shortDetail:
            comp?.status?.type?.shortDetail||""
        }
      },

      venue:{
        fullName:
          comp?.venue?.fullName||""
      }
    }],

    league:{
      id:leagueId,
      name:
        event?.league?.name||
        leagueName(leagueId),
      abbreviation:leagueId,
      logo:
        event?.league?.logo||
        event?.league?.logos?.[0]?.href||
        ""
    },

    season:{
      name:
        event?.season?.displayName||
        event?.season?.name||
        "",

      year:
        event?.season?.year||
        new Date(date).getFullYear()
    }
  };
};

async function request(
  league:string,
  date?:string
){
  const res=await fetch(
    `${BASE_URL}/${league}/scoreboard?dates=${date||dateKey()}&limit=100`
  );

  if(!res.ok)
    throw new Error(`ESPN API Error: ${res.status}`);

  return res.json();
}

export async function getMatches(
  league:string,
  date?:string
):Promise<ApiEvent[]>{
  const data=await request(league,date);

  return(data.events||[])
    .map((e:any)=>normalize(e,league));
}

export async function getAllMatches(
  date?:string
):Promise<ApiEvent[]>{
  const results=await Promise.all(
    ALL_LEAGUES.map(async l=>{
      try{
        return await getMatches(l.id,date);
      }catch(e){
        console.error(
          `Failed to load ${l.name}`,
          e
        );
        return[];
      }
    })
  );

  return results
    .flat()
    .sort(
      (a,b)=>
        new Date(a.date).getTime()-
        new Date(b.date).getTime()
    );
}

export const getTodayMatches=()=>
  getAllMatches(dateKey());

export const getYesterdayMatches=()=>
  getAllMatches(offsetDate(-1));

export const getTomorrowMatches=()=>
  getAllMatches(offsetDate(1));

export const getMatchesByDate=(date:Date)=>
  getAllMatches(dateKey(date));

export async function getLiveMatches(){
  const matches=await getTodayMatches();
  return matches.filter(isMatchLive);
}

export function getMatchStatus(match:ApiEvent){
  const s=
    match.competitions?.[0]?.status?.type;

  if(!s)return"لم تبدأ";

  if(s.completed||s.state==="post")
    return"انتهت";

  if(s.state==="in")
    return s.detail||s.description||"مباشر";

  return"لم تبدأ";
}

export function isMatchLive(match:ApiEvent){
  return match.competitions?.[0]
    ?.status?.type?.state==="in";
}

export function getMatchTeams(match:ApiEvent){
  const teams=
    match.competitions?.[0]?.competitors||[];

  return{
    home:teams.find(
      x=>x.homeAway==="home"
    ),
    away:teams.find(
      x=>x.homeAway==="away"
    )
  };
}

export function getMatchScore(match:ApiEvent){
  const{home,away}=getMatchTeams(match);

  return{
    home:home?.score||"0",
    away:away?.score||"0"
  };
}

export async function getMatchDetails(
  league:string,
  matchId:string
):Promise<MatchDetails|null>{
  try{
    const res=await fetch(
      `${BASE_URL}/${league}/summary?event=${matchId}`
    );

    if(!res.ok)
      throw new Error(
        `ESPN Details Error: ${res.status}`
      );

    const data=await res.json();

    const header=data.header||data;

    const event=normalize(
      header,
      league
    );

    const competition=
      header?.competitions?.[0];

    return{
      event,
      plays:Array.isArray(data.plays)
        ?data.plays
        :[],

      statistics:
        extractStatistics(data),

      leaders:
        extractLeaders(data),

      venue:
        competition?.venue?.fullName||"",

      attendance:
        competition?.attendance
    };

  }catch(e){
    console.error(
      "Failed to load match details:",
      e
    );

    return null;
  }
}

function extractStatistics(
  data:any
):MatchStatistic[]{

  const result:MatchStatistic[]=[];

  const teams=
    data?.boxscore?.teams||[];

  if(teams.length<2)return result;

  const homeStats=
    teams.find(
      (x:any)=>x.homeAway==="home"
    )?.statistics||[];

  const awayStats=
    teams.find(
      (x:any)=>x.homeAway==="away"
    )?.statistics||[];

  homeStats.forEach((h:any)=>{
    const a=awayStats.find(
      (x:any)=>
        x.name===h.name||
        x.displayName===h.displayName
    );

    result.push({
      name:h.name,
      displayName:h.displayName,

      home:String(
        h.displayValue??
        h.value??
        "-"
      ),

      away:String(
        a?.displayValue??
        a?.value??
        "-"
      )
    });
  });

  return result;
}

function extractLeaders(
  data:any
):MatchLeader[]{

  const result:MatchLeader[]=[];

  const leaders=
    data?.leaders||[];

  leaders.forEach((group:any)=>{
    const entries=
      group?.leaders||[];

    entries.slice(0,3).forEach(
      (item:any)=>{
        result.push({
          name:group.name,
          displayName:group.displayName,
          value:item.value,
          athlete:item.athlete
        });
      }
    );
  });

  return result;
}

export const getMatchScoreDetails=(
  matchId:string,
  league:string
)=>
  getMatchDetails(
    league,
    matchId
  );

export type NewsArticle={
  id:string;
  headline:string;
  description?:string;
  published?:string;
  image?:string;
  link?:string;
  source?:string;
  category?:string;
};

export async function getNews():
  Promise<NewsArticle[]>{
  return[];
}