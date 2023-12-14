import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";
import { EOL as LINE_SEPARATOR } from "os";

const mockQuestions = (inputs) => {
	MissionUtils.Console.readLineAsync = jest.fn();

	MissionUtils.Console.readLineAsync.mockImplementation(() => {
		const input = inputs.shift();

		return Promise.resolve(input);
	});
};

const mockRandoms = (numbers) => {
	MissionUtils.Random.pickNumberInRange = jest.fn();
	numbers.forEach(number => {
		MissionUtils.Random.pickNumberInRange.mockReturnValueOnce(number);
	});
};

const mockShuffles = (rows) => {
	MissionUtils.Random.shuffle = jest.fn();

	rows.reduce((acc, [firstNumber, numbers]) => {
		return acc.mockReturnValueOnce([
			firstNumber,
			...numbers.filter((number) => number !== firstNumber),
		]);
	}, MissionUtils.Random.shuffle);
};

const getLogSpy = () => {
	const logSpy = jest.spyOn(MissionUtils.Console, "print");
	logSpy.mockClear();

	return logSpy;
};

const getOutput = (logSpy) => {
	return [...logSpy.mock.calls].join(LINE_SEPARATOR);
};

const expectLogContains = (received, expectedLogs) => {
	expectedLogs.forEach((log) => {
		expect(received).toContain(log);
	});
};

describe("점심 메뉴 테스트", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("전체 기능 테스트", () => {
		test("카테고리 메뉴 중복 없는 추천", async () => {
			const logSpy = getLogSpy();

			mockRandoms([2, 5, 1, 3, 4]);
			mockQuestions(['구구,제임스', '김밥', '떡볶이']);
			mockShuffles([
				// 구구
				[2, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[7, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[1, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[4, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[2, Array.from({ length: 9 }, (_, idx) => idx + 1)],

				// 제임스
				[9, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[1, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[5, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[5, Array.from({ length: 9 }, (_, idx) => idx + 1)],
				[4, Array.from({ length: 9 }, (_, idx) => idx + 1)],
			]);

			const app = new App();
			await app.run(); // 비동기식 함수 실행

			const expected = [
				'점심 메뉴 추천을 시작합니다.',
				'메뉴 추천 결과입니다.',
				'[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]',
				'[ 카테고리 | 한식 | 양식 | 일식 | 중식 | 아시안 ]',
				'[ 구구 | 김치찌개 | 스파게티 | 규동 | 짜장면 | 카오 팟 ]',
				'[ 제임스 | 제육볶음 | 라자냐 | 가츠동 | 짬뽕 | 파인애플 볶음밥 ]',
				'추천을 완료했습니다.'
			];

			expectLogContains(getOutput(logSpy), expected);
			
		});
	});
});



