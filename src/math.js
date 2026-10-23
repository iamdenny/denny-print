import { rng, shuffle } from './logic.js';
export const mathFamilies = [
 {id:'add', start:1, title:['Adding {n}','{n} 더하기','{n}を足す','Sumar {n}'], how:['Add the fixed number to each starting value. Count on or split the sum into tens and ones.','시작 수에 정해진 수를 더하세요. 이어 세거나 십의 자리와 일의 자리로 나누어 계산하세요.','最初の数に決まった数を足します。続けて数えるか、十の位と一の位に分けて計算しましょう。','Añade el número fijo a cada valor. Cuenta hacia delante o separa decenas y unidades.']},
 {id:'subtract',start:1,title:['Subtracting {n}','{n} 빼기','{n}を引く','Restar {n}'],how:['Subtract the fixed number. Check by adding it back to your answer; no result is negative.','정해진 수를 빼세요. 답에 뺀 수를 다시 더해 확인하세요. 음수 답은 나오지 않습니다.','決まった数を引きます。答えに引いた数を足して確認しましょう。答えは負になりません。','Resta el número fijo. Comprueba sumándolo de nuevo a la respuesta; no hay resultados negativos.']},
 {id:'multiply',start:2,title:['Extended {n} times table','{n}단 확장 곱셈','{n}の段の発展練習','Tabla ampliada del {n}'],how:['Multiply the fixed factor by each number. Think of equal groups; this extended table includes factors beyond twelve.','정해진 수에 각 수를 곱하세요. 같은 크기의 묶음으로 생각해 보세요. 12보다 큰 수도 포함한 확장 연습입니다.','決まった数に各数をかけます。同じ大きさのまとまりで考えましょう。12を超える数も含む発展練習です。','Multiplica el factor fijo por cada número. Piensa en grupos iguales; la tabla ampliada incluye factores mayores que doce.']},
 {id:'divide',start:2,title:['Dividing by {n}','나누는 수 {n}','{n}で割る','Dividir entre {n}'],how:['Share each dividend into equal groups. Every division is exact. Multiply your answer by the divisor to check.','각 수를 같은 크기의 묶음으로 나누세요. 모두 나머지 없이 나누어집니다. 답에 나누는 수를 곱해 확인하세요.','それぞれの数を等しく分けます。すべて割り切れます。答えに割る数をかけて確認しましょう。','Reparte cada dividendo en grupos iguales. Todas las divisiones son exactas. Multiplica por el divisor para comprobar.']},
 {id:'missing-add',start:1,title:['Missing addends with {n}','{n} 더하기 빈칸','{n}を足す空欄問題','Sumando que falta con {n}'],how:['Find the missing starting number. Subtract the known addend from the total, then verify the complete equation.','빠진 시작 수를 찾으세요. 합에서 알려진 수를 빼고 완성한 식을 확인하세요.','空欄の数を求めます。合計から分かっている数を引き、式を確認しましょう。','Encuentra el número inicial. Resta el sumando conocido del total y verifica la ecuación completa.']},
 {id:'missing-subtract',start:1,title:['Missing minuends with {n}','{n} 빼기 시작 수 찾기','{n}を引く前の数','Minuendo que falta con {n}'],how:['Find the number before subtraction. Add the known difference and the number being subtracted.','빼기 전의 수를 찾으세요. 차에 빼는 수를 더하면 시작 수가 됩니다.','引く前の数を求めます。差と引く数を足すと元の数になります。','Encuentra el número anterior a la resta. Suma la diferencia y el número que se resta.']},
 {id:'missing-factor',start:2,title:['Missing factors in table {n}','{n}단 곱하는 수 찾기','{n}の段の空欄','Factor que falta: tabla del {n}'],how:['Find the missing factor by dividing the product by the known factor. Every answer is a whole number.','곱을 알려진 수로 나누어 빠진 수를 찾으세요. 모든 답은 정수입니다.','積を分かっている数で割って空欄を求めます。答えはすべて整数です。','Divide el producto por el factor conocido para hallar el que falta. Todas las respuestas son enteras.']},
 {id:'compare',start:1,title:['Compare numbers up to {n}0','{n}0까지 수 비교','{n}0までの数比べ','Comparar números hasta {n}0'],how:['Write <, > or = in each box. Compare the highest place value first. The open side points to the larger number.','빈칸에 <, > 또는 =를 쓰세요. 높은 자릿수부터 비교하며 열린 쪽이 큰 수를 향합니다.','空欄に<、>、=を書きます。大きい位から比べ、不等号の開いた側を大きい数に向けます。','Escribe <, > o =. Compara primero la posición mayor; la abertura del signo apunta al número mayor.']},
 {id:'sequence',start:2,title:['Skip counting by {n}','{n}씩 뛰어 세기','{n}ずつ数える','Contar de {n} en {n}'],how:['Find the next number in each sequence. Each step adds the same amount; write the fourth term.','규칙에 따라 다음 수를 찾으세요. 매번 같은 수를 더해 네 번째 수를 쓰세요.','同じ数ずつ増える数列です。次に来る4番目の数を書きましょう。','Encuentra el siguiente número. Cada paso suma la misma cantidad; escribe el cuarto término.']},
 {id:'fraction',start:2,title:['One over {n} of a quantity','수량의 {n}분의 1','数量の{n}分の1','1/{n} de una cantidad'],how:['Find one equal part of the whole quantity. Divide by the denominator; the quantities are chosen to give whole-number answers.','전체를 똑같이 나눈 한 부분을 구하세요. 분모로 나누면 됩니다. 답이 정수가 되는 수량을 사용합니다.','全体を等分した1つ分を求めます。分母で割ります。答えが整数になる数量を使います。','Halla una parte igual del total dividiendo entre el denominador. Las cantidades dan respuestas enteras.']}
];
// Twenty-four exercises per edition; all generated operands stay small enough for pencil-and-paper work.
export const mathActivities = mathFamilies.flatMap(f => Array.from({length:10},(_,i)=>{
 const n=f.start+i;
 return {id:`${f.id}-${n}`, family:f.id, n, title:f.title.map(x=>x.replaceAll('{n}',n)), how:f.how};
}));
export function mathWorksheet(id,seed=1) {
 const p=mathActivities.find(x=>x.id===id);
 if(!p) throw Error('Unknown math activity');
 const n=p.n;
 const pool=Array.from({length:48},(_,i)=>{
  const a=i, k=i+1;
  let prompt,answer,left,right;
  switch(p.family){
   case 'add': left=a;right=n;prompt=`${a} + ${n} = □`;answer=a+n;break;
   case 'subtract':left=a+n;right=n;prompt=`${a+n} − ${n} = □`;answer=a;break;
   case 'multiply':left=n;right=k;prompt=`${n} × ${k} = □`;answer=n*k;break;
   case 'divide':left=n*k;right=n;prompt=`${n*k} ÷ ${n} = □`;answer=k;break;
   case 'missing-add':left=n;right=a+n;prompt=`□ + ${n} = ${a+n}`;answer=a;break;
   case 'missing-subtract':left=n;right=a;prompt=`□ − ${n} = ${a}`;answer=a+n;break;
   case 'missing-factor':left=n;right=n*k;prompt=`${n} × □ = ${n*k}`;answer=k;break;
   case 'compare':left=i%(n*10+1);right=(Math.floor(i/(n*10+1))*7+i*3+1)%(n*10+1);prompt=`${left} □ ${right}`;answer=left<right?'<':left>right?'>':'=';break;
   case 'sequence':left=a;right=n;prompt=`${a}, ${a+n}, ${a+2*n}, □`;answer=a+3*n;break;
   case 'fraction':left=n*k;right=n;prompt=`(1/${n}) × ${n*k} = □`;answer=k;break;
  }
  return {prompt,answer,left,right};
 });
 const unique=[...new Map(pool.map(q=>[q.prompt,q])).values()];
 if(unique.length<24)throw Error('Not enough distinct exercises');
 return shuffle(unique,rng(seed)).slice(0,24);
}
