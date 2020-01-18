package ua.com.flowershop.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.entity.OrderItem;
import ua.com.flowershop.entity.User;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@Slf4j
@Service
public class PoiExporter {

    private static final String FONT_NAME = "Arial";
    private static final short FONT_SIZE = 12;
    private static final short HEADER_FONT_SIZE = 14;
    private static final short TITLE_FONT_SIZE = 16;
    private static final float PAGE_WIDTH = 8.43f;

    @Transactional
    public Workbook exportOrderToExcel(Order order, XSSFWorkbook workbook) {
        User user = order.getUser();

        if (isNull(workbook)) {
            workbook = new XSSFWorkbook();
        }

        XSSFSheet sheet = workbook.createSheet("Замовлення № " + order.getId());

        sheet.setDefaultColumnWidth(16);

        XSSFFont defaultFont = workbook.createFont();
        defaultFont.setFontName(FONT_NAME);
        defaultFont.setFontHeightInPoints(FONT_SIZE);
        defaultFont.setColor(IndexedColors.BLACK.getIndex());
        defaultFont.setBold(false);

        XSSFFont boldFont = workbook.createFont();
        boldFont.setFontName(FONT_NAME);
        boldFont.setFontHeightInPoints(FONT_SIZE);
        boldFont.setColor(IndexedColors.BLACK.getIndex());
        boldFont.setBold(true);

        XSSFFont headerFont = workbook.createFont();
        headerFont.setFontName(FONT_NAME);
        headerFont.setFontHeightInPoints(HEADER_FONT_SIZE);
        headerFont.setColor(IndexedColors.BLACK.getIndex());
        headerFont.setBold(true);

        XSSFFont titleFont = workbook.createFont();
        titleFont.setFontName(FONT_NAME);
        titleFont.setFontHeightInPoints(TITLE_FONT_SIZE);
        titleFont.setColor(IndexedColors.BLACK.getIndex());
        titleFont.setBold(true);

        Integer rowNum = 0;
        int colNum = 0;

        sheet.addMergedRegion(new CellRangeAddress(3,3,0,4));
        sheet.addMergedRegion(new CellRangeAddress(6,6,0,4));

        //  MAIN TITLE

        Row row = sheet.createRow(rowNum++);
        Cell cell = row.createCell(0);
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setFont(titleFont);
        cell.setCellValue("ЗАМОВЛЕННЯ №" + order.getId());
        cell.setCellStyle(cellStyle);
        rowNum++;

        //  CLIENT TITLE

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(boldFont);
        cell.setCellValue("ЗАМОВНИК:");
        cell.setCellStyle(cellStyle);

        //  CLIENT INFO

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue(user.getName() + ", " + user.getPhone());
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(defaultFont);
        cell.setCellStyle(cellStyle);
        rowNum++;

        //  DELIVERY INFO TITLE

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(boldFont);
        cell.setCellValue("ДОСТАВКА:");
        cell.setCellStyle(cellStyle);

        //  DELIVERY INFO

        row = sheet.createRow(rowNum++);
        row.setHeight((short) (row.getHeight() * 3));
        cell = row.createCell(0);
        cell.setCellValue(order.getDeliveryAddress());
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(defaultFont);
        cellStyle.setVerticalAlignment(VerticalAlignment.TOP);
        cell.setCellStyle(cellStyle);

        rowNum++;

        // ORDER ITEMS HEADER

        CellStyle tableHeaderStyle = workbook.createCellStyle();
        tableHeaderStyle.setFont(boldFont);
        tableHeaderStyle.setBorderBottom(BorderStyle.THIN);
        tableHeaderStyle.setBorderTop(BorderStyle.THIN);
        tableHeaderStyle.setBorderRight(BorderStyle.THIN);
        tableHeaderStyle.setBorderLeft(BorderStyle.THIN);
        tableHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        row = sheet.createRow(rowNum++);
        row.setHeight((short) (row.getHeight() * 2));

        cell = row.createCell(0);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Назва");

        cell = row.createCell(1);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Розмір");

        cell = row.createCell(2);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Ціна");

        cell = row.createCell(3);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Кількість");

        cell = row.createCell(4);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Сума");

        // ORDER ITEMS TABLE

        fillOrderItems(workbook, sheet, defaultFont, rowNum, new ArrayList<>(order.getOrderItems()));

        rowNum += order.getOrderItems().size() + 1;

        // TOTAL PRICE TITLE

        row = sheet.createRow(rowNum++);

        if (order.getDiscount() > 0) {
            cell = row.createCell(3);
            cellStyle = workbook.createCellStyle();
            cellStyle.setFont(defaultFont);
            cell.setCellValue("ЗНИЖКА:");
            cell.setCellStyle(cellStyle);
        }

        cell = row.createCell(4);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(defaultFont);
        cell.setCellValue("РАЗОМ:");
        cell.setCellStyle(cellStyle);

        // TOTAL PRICE

        row = sheet.createRow(rowNum++);

        if (order.getDiscount() > 0) {
            cell = row.createCell(3);
            cellStyle = workbook.createCellStyle();
            cellStyle.setFont(boldFont);
            cell.setCellValue(order.getDiscount() / 100 + " грн");
            cell.setCellStyle(cellStyle);
        }


        cell = row.createCell(4);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(boldFont);
        cell.setCellValue((order.getTotalPrice() - order.getDiscount())/ 100 + " грн");
        cell.setCellStyle(cellStyle);

        //  CONTACTS TITLE

        rowNum += 2;

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(boldFont);
        cell.setCellValue("НАШІ КОНТАКТИ:");
        cell.setCellStyle(cellStyle);

        //  CONTACTS

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,4));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Тел: 0507072637, 0970559095");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(defaultFont);
        cell.setCellStyle(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,4));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Email: merryflowersua@gmail.com");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(defaultFont);
        cell.setCellStyle(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,4));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Сайт: www.merryflowers.com.ua");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(defaultFont);
        cell.setCellStyle(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,4));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Група в Facebook: facebook.com/groups/merryflowers");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(defaultFont);
        cell.setCellStyle(cellStyle);


        return workbook;
    }

    private void fillOrderItems(XSSFWorkbook workbook, XSSFSheet sheet, XSSFFont font, Integer rowNum, List<OrderItem> orderItems) {

        orderItems = orderItems.stream().sorted(Comparator.comparing(o -> o.getFlowerSize().getFlower().getName())).collect(Collectors.toList());

        CellStyle tableCellStyle = workbook.createCellStyle();
        tableCellStyle.setFont(font);
        tableCellStyle.setBorderBottom(BorderStyle.THIN);
        tableCellStyle.setBorderTop(BorderStyle.THIN);
        tableCellStyle.setBorderRight(BorderStyle.THIN);
        tableCellStyle.setBorderLeft(BorderStyle.THIN);
        tableCellStyle.setWrapText(true);
        tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        for (int i = 0; i < orderItems.size(); i++) {
            OrderItem orderItem = orderItems.get(i);
            FlowerSize flowerSize = orderItem.getFlowerSize();

            Row row = sheet.createRow(rowNum++);
            Cell cell = row.createCell(0);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getFlower().getName());

            cell = row.createCell(1);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getSize().getName());

            cell = row.createCell(2);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(orderItem.getPrice() / 100 + " грн");

            cell = row.createCell(3);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(orderItem.getAmount() + " шт");

            cell = row.createCell(4);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(orderItem.getAmount() * orderItem.getPrice() / 100 + " грн");

        }


    }

    @Transactional
    public Workbook exportOrdersToExcel(Page<Order> ordersPage) {

        XSSFWorkbook workbook = new XSSFWorkbook();

        for (int i = 0; i < ordersPage.getContent().size(); i++) {
            Order order = ordersPage.getContent().get(i);
            exportOrderToExcel(order, workbook);
        }

        return workbook;
    }

}
