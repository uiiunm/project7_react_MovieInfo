import { useEffect, useState, useRef } from 'react' ;
import { Link } from 'react-router-dom';
import './Mv.css'; 


function Boxoffice() {
  //state변수 
  const [viewDay, setViewDay] = useState() ;
  const [viewDayF, setViewDayF] = useState() ;
  const [officeList, setOfficeList] = useState([]) ;

  //ref변수 
  const refDateIn = useRef() ;

   //비동기 통신 : async ... await
  const getBoxoffice = async (d) => {
    let url = 'https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?';
    url = url + 'key=' + 'f5eef3421c602c6cb7ea224104795888' ;
    url = url + '&targetDt=' + d;

    //비동기 통신
    try {
      const resp = await fetch(url);
      const data = await resp.json();

      console.log(data.boxOfficeResult.dailyBoxOfficeList);
      let dailyBoxOfficeList = data.boxOfficeResult.dailyBoxOfficeList ;
      setOfficeList(
        dailyBoxOfficeList.map((item) => 
        <li key={item.movieCd} className="ListS">
          <Link to={'/mv?mvcd=' + item.movieCd} className="ListL">
          <span className=''>{item.rank}위.ㅤ</span>
          <span className=''>{item.movieNm}</span>
          <span className=''>ㅤ[순위상승]{item.rankInten > 0 ? '⬆️' : item.rankInten < 0 ? '⬇️' : ''}</span>
          {Math.abs(Number(item.rankInten))}
          </Link>
        </li>)
      )



    }
    catch (err) {
      console.log(err);
    }
  }

  //페이지 처음 랜더링이 되었을때 실행되는 HOOK
  useEffect(() => {
    //어제 날짜 추출
    const yesterday = new Date() ;
    yesterday.setDate(new Date().getDate() - 1) ;
    let d = yesterday.toISOString().substring(0, 10).replaceAll('-','');

    //박스오피스 open API 호출
    getBoxoffice(d);
  }, []);

  useEffect(() => {
    //console.log(viewDay);
    (viewDay && setViewDayF(viewDay.substring(0,4)+'.'+viewDay.substring(4,6)+'.'+viewDay.substring(6,8)))
    
    getBoxoffice(viewDay);
  }, [viewDay]) ;



  //이벤트 함수
  const handleChange = (e) => {
    e.preventDefault();

    setViewDay(refDateIn.current.value.replaceAll('-',''));
  }

  return (
    <>
      <h1 className='infoH1'>🎬 박스오피스 🎬 {viewDayF}</h1> 
      <form className='form1'>
      <input type="date" name="dateIn" ref={refDateIn} onChange={handleChange} />
      </form>
      <ul>
      {officeList}
      </ul>
    </>
  );
}

export default Boxoffice ;