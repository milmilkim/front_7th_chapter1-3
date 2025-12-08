구현되어 있는 앱에 대한 e2e 테스트를 작성하는 과제이다.

- e2e 테스트
playwright를 처음으로 사용해보았다.
(회사에서 e2e 테스트를 작성할 떄는 시험적으로 cypress를 사용했고, 프로젝트에서는 webdriver.io로 자체적인 프레임워크 개발과 테스트 코드 작성을 진행했다.)
이것저것 새로운 툴을 사용해보는 것 자체의 즐거움이 있다.
playwright를 사용하면 ci의 actions에서 테스트 리포트를 볼 수 있고 실패하거나 재시도한 테스트의 동영상을 업로드 할 수 있어서 편리하다. 깃허브의 자원을 사용할 수 있고..
fixture(https://playwright.dev/docs/test-fixtures) 라는 것도 있다.  글로벌 훅 처럼 사용할 수 있고 테스트 설정을 할 수 있고 복잡한 동작을 그룹화 할 수 있다.
(나의 견해로는... 테스트코드에서는 공통화는 보수적으로 하는 게 좋다.)


테스트 환경을 격리 시키는 부분은, 통합테스트에서는 msw를 사용했지만 e2e에서는 mocking을 지양하기 때문에 사용하지 않았다. 하지만 그럴 때 각 테스트가 독립되지 않는다는 문제가 생긴다.
회사에서도 e2e 테스트를 할 때 가장 고통받았던(?) 부분이다. 수동으로 생성-조회-수정-삭제를 최대한 한 사이클로 관리하려 했지만 생각보다 어렵다. 하지만 과제에서는 api 환경도 설정할 수 있기 때문에 원활하게 잘 깨지지 않는 테스트를 만들 수 있다. (그리고, E2E 테스트는 어차피 다른 팀이 전혀 협조해주지 않고서는 제대로 진행할 수 없다.)
브라우저 상에서 실행되기 때문에 속도가 느리고, 이런 저런 외부 요인에도 영향을 받기 때문에 테스트 케이스를 추가하기는 부담스럽지만 mocking 같은 것을 신경 쓸 필요가 없기 때문에 구현 자체는 더 쉬운 것 같기도 하다.

- 시각적 회귀 테스트 
스토리북 자체는 개인적으로 사용해 본 적 있지만 크로마틱을 사용한 빌드 및 시각적 회귀 테스트는 처음 해본다.
https://690986ae34d3026926a18f0f-zwkhnxwwtc.chromatic.com/
<img width="718" height="511" alt="image" src="https://github.com/user-attachments/assets/c71e1968-76b3-4cd4-931a-02083b838da3" />

- 테스트 전략
일반적으로 테스트 피라미드를 많이 얘기하지만 프론트엔드 테스트는 Kent C. Dodds의 테스트 트로피가 이상적인 것 같다.
https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests#speed---
현실에서도 많은 단위 테스트를 다 작성할 시간이 없을 것 같고 단순한 유틸 함수도 테스트를 만들 필요는 없을 것 같다.
E2E 테스트는 가장 적게 가져가는 것이 맞다. 느리고 비용이 (매우) 많이 들어가기 때문이다. 예를 들어 폼의 밸리데이션 체크 하나를 확인하기 위해 모든 선행 과정을 거치는 것은 비용 대비 효율이 좋지 않아 통합테스트가 더 적합하다. 
하지만 이 과제에서는 그렇게 많은 선행 과정이 필요하지 않고(로그인이라든가, 각종 권한이라든가...) 백엔드, DB 문제도 크지 않은 것 같았기에 E2E 테스트의 비중을 늘리는 것도 괜찮은 방법이라고 생각했다. 

https://www.figma.com/board/LvoDa8MM7XwsUKqq0yGxFD

 - 팀원들 사이에서는 통합테스트의 비중이 더 많아야 된다는 의견도 있었고 유닛 테스트의 비중이 더 많아야 한다는 의견도 있었지만, 통합 테스트 쪽이 더 우세하였다. 절대 깨져서는 안되는 기능/열악한 network 환경에서의 로그인/ 결제 작업/크로스 브라우저 등이 E2E 테스트에 필요하다고 보았다. 통합 테스트는 E2E 테스트보다 빠르고 안정적이며, 단위 테스트보다는 많은 버그를 발견할 수 있다. 과한 단위테스트는 유지보수 비용만 증가시킨다는 의견이 많았다.

 - 개발을 하면서 통합 테스트를 우선적으로 작성하고, 엣지 케이스 등의 단위 테스트를 추가하고, E2E 테스트는 개발 중에는 어렵기 때문에 최종적으로 추가하는 쪽으로 결론을 내렸다. 

  - 이 과제에서는 폼 관련한 기능은 통합 테스트 위주로, 드래그 앤 드롭은 E2E 테스트로 진행하고, 좀 더 안정적인 테스트를 위한 추가적인 단위 테스트를 작성하기로 했다. 
https://github.com/hanghae-plus/front_7th_chapter1-3/pull/21/commits/088cd443c877654a21507c24326bc49e1e200124


아무 생각 없이 e2e 테스트를 작성하려 하다가 어떻게 DB를 격리 시킬 수 있을지 고민을 했다. 
이벤트 이름을 uuid로 만들어서 저장할까? 하는 생각을 잠깐 했었는데 server.js를 열어보니 `process.env.TEST_ENV` 환경변수와 `e2e.json`이 있어서 그걸 사용하기로 했다. (playwright 설정)
```json
 webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      TEST_ENV: 'e2e',
    },
  },
```
그리고 `/__test__/reset`과 `/__test__/seed` API를 추가했다. 전자는 DB를 초기화 하며 후자는 DB의 초기 데이터를 넣어준다.

이렇게 했더니 병렬 실행을 했을 때 문제가 생긴다...😃 그래서 처음엔 일단 순차적으로만 실행되게 했지만 느려서 아쉽기 때문에... 
`TestInfo`에서 worker index를 가져와서 커스텀 헤더에 넣었다.
```ts
   // src/__tests__/e2e/fixtures.ts

      globalHooks: [
    async ({ page }, use, testInfo) => {
      //--- ⬇️ beforeEach 로직 시작 ⬇️ ---//
      console.log('======================');

      // 브라우저의 모든 요청에 워커 인덱스 헤더 추가
      await page.setExtraHTTPHeaders({
        'X-Worker-Index': String(testInfo.workerIndex),
      });

      await resetDb(testInfo.workerIndex);

      ...
```

```js
// server.js
const getDbName = (req) => {
  if (process.env.TEST_ENV !== 'e2e') {
    return 'realEvents.json';
  }

  const workerIndex = req.workerIndex;
  if (workerIndex === undefined) {
    throw new Error('Worker index not found in request');
  }
  return `e2e-worker-${workerIndex}.json`;
};
```
워커마다 다른 json 파일을 사용했다. 
이 파일들은 global-teardown에서 삭제되도록 했다.

<img width="711" height="161" alt="image" src="https://github.com/user-attachments/assets/68f9cf36-d3aa-414e-91b6-d09ae3f9bbed" />
ci에서 2개의 워커가 돌아간다. 일반적으로 CI 환경에서는 병렬실행이 불안정하고 큰 이득이 없지만, 이번 과제는 병렬 구조 학습에 목적이 있었기 때문에 ci에서도 병렬 실행이 되도록 설정하였다. 

