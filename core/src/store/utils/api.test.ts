// core/src/store/utils/api.test.ts
import { generateEntityReadApis } from './api';
import { apiGet } from '../../api/apiServices';

jest.mock('../../api/apiServices', () => ({
  apiGet: jest.fn(),
}));

type TestEntity = { id: number; name: string };

describe('generateEntityReadApis', () => {
  it('should call apiGet with correct params for getList', async () => {
    const apis = generateEntityReadApis<number, TestEntity>({ path: '/test', includeDisplayContext: false });
    await apis.getList({} as any);
    expect(apiGet).toHaveBeenCalledWith(
      '/test',
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('should call apiGet with correct params for getItem', async () => {
    const apis = generateEntityReadApis<number, TestEntity>({ path: '/test', includeDisplayContext: false });
    await apis.getItem(1, { dataSet: undefined });
    expect(apiGet).toHaveBeenCalledWith('/test/1', undefined);
  });
});