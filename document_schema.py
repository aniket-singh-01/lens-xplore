from typing import Optional, List, Dict, Union, Any
from pydantic import BaseModel


class TaxSchema(BaseModel):
    name: Optional[Union[float, int, str]]
    rate: Optional[Union[float, int, str]]
    percentage: Optional[Union[float, int, str]]
    amount: Optional[Union[float, int, str]]


class ItemsSchema(BaseModel):
    name: Optional[str]
    quantity: Optional[Union[float, int, str]]
    price: Optional[Union[float, int, str]]
    taxes: List[TaxSchema]


class DocumentSchema(BaseModel):
    gst_number: Optional[str]
    classification: Optional[Union[float, int, str]]
    vendor: Optional[Union[float, int, str]]
    bill_number: Optional[Union[float, int, str]]
    bill_date: Optional[Union[float, int, str]]
    items: Optional[List[ItemsSchema]]
    grand_total: Optional[Union[float, int, str]]
