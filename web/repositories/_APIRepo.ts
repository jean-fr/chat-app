import { HTTPClient } from '../clients/Http';

export default class _APIRepo {
  protected endPoint = '';

  constructor(protected http: HTTPClient, protected url: string) {}
}
