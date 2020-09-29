package ua.com.flowershop.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.*;

import java.text.Collator;
import java.time.format.DateTimeFormatter;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;

import static java.time.LocalDate.now;
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

        sheet.setDefaultColumnWidth(15);
        sheet.setColumnWidth(0, 1200);
        sheet.setColumnWidth(1, 3000);
        sheet.setColumnWidth(2, 6000);
        sheet.setColumnWidth(3, 2900);
        sheet.setColumnWidth(4, 2900);
        sheet.setColumnWidth(5, 3100);
        sheet.setColumnWidth(6, 3100);

        XSSFFont fontDefault = workbook.createFont();
        fontDefault.setFontName(FONT_NAME);
        fontDefault.setFontHeightInPoints(FONT_SIZE);
        fontDefault.setColor(IndexedColors.BLACK.getIndex());
        fontDefault.setBold(false);

        XSSFFont fontBold = workbook.createFont();
        fontBold.setFontName(FONT_NAME);
        fontBold.setFontHeightInPoints(FONT_SIZE);
        fontBold.setColor(IndexedColors.BLACK.getIndex());
        fontBold.setBold(true);

        XSSFFont fontHeader = workbook.createFont();
        fontHeader.setFontName(FONT_NAME);
        fontHeader.setFontHeightInPoints(HEADER_FONT_SIZE);
        fontHeader.setColor(IndexedColors.BLACK.getIndex());
        fontHeader.setBold(true);

        XSSFFont fontTitle = workbook.createFont();
        fontTitle.setFontName(FONT_NAME);
        fontTitle.setFontHeightInPoints(TITLE_FONT_SIZE);
        fontTitle.setColor(IndexedColors.BLACK.getIndex());
        fontTitle.setBold(true);

        int rowNum = 0;

        sheet.addMergedRegion(new CellRangeAddress(3,3,0,6));
        sheet.addMergedRegion(new CellRangeAddress(6,6,0,6));

        //  MAIN TITLE

        Row row = sheet.createRow(rowNum++);
        Cell cell = row.createCell(0);
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setFont(fontTitle);
        cell.setCellValue("ЗАМОВЛЕННЯ №" + order.getId());
        cell.setCellStyle(cellStyle);
        rowNum++;

        //  CLIENT TITLE

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(fontBold);
        cell.setCellValue("ЗАМОВНИК:");
        cell.setCellStyle(cellStyle);

        //  CLIENT INFO

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue(user.getName() + ", " + user.getPhone());
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(fontDefault);
        cell.setCellStyle(cellStyle);
        rowNum++;

        //  DELIVERY INFO TITLE

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(fontBold);
        cell.setCellValue("ДОСТАВКА:");
        cell.setCellStyle(cellStyle);

        //  DELIVERY INFO

        row = sheet.createRow(rowNum++);
        row.setHeight((short) (row.getHeight() * 3));
        cell = row.createCell(0);
        cell.setCellValue(order.getDeliveryAddress());
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(fontDefault);
        cellStyle.setVerticalAlignment(VerticalAlignment.TOP);
        cell.setCellStyle(cellStyle);

        rowNum++;

        // ORDER ITEMS HEADER

        CellStyle tableHeaderStyle = workbook.createCellStyle();
        tableHeaderStyle.setFont(fontBold);
        tableHeaderStyle.setBorderBottom(BorderStyle.THIN);
        tableHeaderStyle.setBorderTop(BorderStyle.THIN);
        tableHeaderStyle.setBorderRight(BorderStyle.THIN);
        tableHeaderStyle.setBorderLeft(BorderStyle.THIN);
        tableHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        tableHeaderStyle.setAlignment(HorizontalAlignment.CENTER);

        row = sheet.createRow(rowNum++);
        row.setHeight((short) (row.getHeight() * 2));

        cell = row.createCell(0);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("№");

        cell = row.createCell(1);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Артикул");

        cell = row.createCell(2);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Назва");

        cell = row.createCell(3);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Розмір");

        cell = row.createCell(4);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Ціна");

        cell = row.createCell(5);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Кількість");

        cell = row.createCell(6);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Сума");

        // ORDER ITEMS TABLE

        fillOrderItems(workbook, sheet, fontDefault, fontBold, rowNum, new LinkedList<>(order.getOrderItems()));

        rowNum += order.getOrderItems().size() + 1;

        // TOTAL PRICE TITLE

        row = sheet.createRow(rowNum++);

        if (order.getDiscount() > 0) {
            cell = row.createCell(5);
            cellStyle = workbook.createCellStyle();
            cellStyle.setFont(fontDefault);
            cell.setCellValue("ЗНИЖКА:");
            cell.setCellStyle(cellStyle);
        }

        cell = row.createCell(6);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(fontDefault);
        cell.setCellValue("РАЗОМ:");
        cell.setCellStyle(cellStyle);

        // TOTAL PRICE

        row = sheet.createRow(rowNum++);

        if (order.getDiscount() > 0) {
            cell = row.createCell(5);
            cellStyle = workbook.createCellStyle();
            cellStyle.setFont(fontBold);
            cell.setCellValue(order.getDiscount() / 100 + " грн");
            cell.setCellStyle(cellStyle);
        }


        cell = row.createCell(6);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(fontBold);
        cell.setCellValue((order.getTotalPrice() - order.getDiscount())/ 100 + " грн");
        cell.setCellStyle(cellStyle);

        //  CONTACTS TITLE

        rowNum += 2;

        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cellStyle = workbook.createCellStyle();
        cellStyle.setFont(fontBold);
        cell.setCellValue("НАШІ КОНТАКТИ:");
        cell.setCellStyle(cellStyle);

        //  CONTACTS

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,5));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Тел: 0507072637, 0970559095");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(fontDefault);
        cell.setCellStyle(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,5));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Email: merryflowersua@gmail.com");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(fontDefault);
        cell.setCellStyle(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,5));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Сайт: www.merryflowers.com.ua");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(fontDefault);
        cell.setCellStyle(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,5));
        row = sheet.createRow(rowNum++);
        cell = row.createCell(0);
        cell.setCellValue("Група в Facebook: facebook.com/groups/merryflowers");
        cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(fontDefault);
        cell.setCellStyle(cellStyle);

        return workbook;
    }

    private void fillOrderItems(XSSFWorkbook workbook, XSSFSheet sheet, XSSFFont font, XSSFFont fontBold, Integer rowNum, LinkedList<OrderItem> orderItems) {

        orderItems.sort((oi1, oi2) -> {
            Collator uaCollator1 = Collator.getInstance(new Locale("uk", "UA"));

            int flowerTypeCompare = uaCollator1.compare(oi1.getFlowerSize().getFlower().getFlowerType().getNameSingle(), oi2.getFlowerSize().getFlower().getFlowerType().getNameSingle());

            if (flowerTypeCompare != 0) {
                return flowerTypeCompare;
            }

            Group group1 = oi1.getFlowerSize().getFlower().getGroup();
            Group group2 = oi2.getFlowerSize().getFlower().getGroup();

            if (group1 == null && group2 != null) {
                return 1;
            }

            if (group1 != null && group2 == null) {
                return -1;
            }

            if (group1 != null && group2 != null) {
                int flowerGroupCompare = uaCollator1.compare(group1.getNameSingle(), group2.getNameSingle());
                if (flowerGroupCompare != 0) {
                    return flowerGroupCompare;
                }
            }

            return oi1.getFlowerSize().getFlower().getNameOriginal().compareTo(oi2.getFlowerSize().getFlower().getNameOriginal());
        });

        XSSFCellStyle tableCellStyleWhite = workbook.createCellStyle();
        tableCellStyleWhite.setFont(font);
        tableCellStyleWhite.setBorderBottom(BorderStyle.THIN);
        tableCellStyleWhite.setBorderTop(BorderStyle.THIN);
        tableCellStyleWhite.setBorderRight(BorderStyle.THIN);
        tableCellStyleWhite.setBorderLeft(BorderStyle.THIN);
        tableCellStyleWhite.setWrapText(true);
        tableCellStyleWhite.setVerticalAlignment(VerticalAlignment.CENTER);
        tableCellStyleWhite.setAlignment(HorizontalAlignment.RIGHT);
        tableCellStyleWhite.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        tableCellStyleWhite.setFillForegroundColor(IndexedColors.WHITE.getIndex());

        XSSFCellStyle tableCellStyleGrey = workbook.createCellStyle();
        tableCellStyleGrey.cloneStyleFrom(tableCellStyleWhite);

        String greyColorHex = "F0F0F0";
        byte[] greyColorByte = new byte[0];
        try {
            greyColorByte = Hex.decodeHex(greyColorHex);
        } catch (DecoderException e) {
            e.printStackTrace();
        }
        XSSFColor color = new XSSFColor(greyColorByte, null);
        tableCellStyleGrey.setFillForegroundColor(color);

        Long lastGroupId = null;
        Long lastFlowerTypeId = null;
        CellStyle tableCellStyle = tableCellStyleWhite;

        for (int i = 0; i < orderItems.size(); i++) {
            OrderItem orderItem = orderItems.get(i);
            FlowerSize flowerSize = orderItem.getFlowerSize();
            Flower flower = flowerSize.getFlower();
            Group group = flower.getGroup();

            if (lastGroupId != null && (group != null && !lastGroupId.equals(group.getId())
                || (lastFlowerTypeId != null && !lastFlowerTypeId.equals(flower.getFlowerType().getId())))) {
                if (tableCellStyle == tableCellStyleWhite) {
                    tableCellStyle = tableCellStyleGrey;
                } else {
                    tableCellStyle = tableCellStyleWhite;
                }
            }

            lastGroupId = group != null ? group.getId() : 0;
            lastFlowerTypeId = flower.getFlowerType().getId();

            Row row = sheet.createRow(rowNum++);

            Cell cell = row.createCell(0);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(i + 1);

            cell = row.createCell(1);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getCode());

            cell = row.createCell(2);
            cell.setCellStyle(tableCellStyle);

            String name = flower.getNameOriginal();
            if (isNull(name)) {
                name = flower.getName();
            }

            String groupNamePart = "";

            if (group != null) {
                groupNamePart = ", " + group.getNameSingle();
            }

            XSSFRichTextString fullName = new XSSFRichTextString();
            fullName.append(flower.getFlowerType().getNameSingle() + groupNamePart + "\n", font);
            fullName.append(name, fontBold);
            cell.setCellValue(fullName);

            cell = row.createCell(3);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getSize().getName());

            cell = row.createCell(4);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(orderItem.getPrice() / 100 + " грн");

            cell = row.createCell(5);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(orderItem.getAmount() + " шт");

            cell = row.createCell(6);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(orderItem.getAmount() * orderItem.getPrice() / 100 + " грн");

        }

    }

    @Transactional
    public Workbook exportLeftoversToExcel(List<FlowerSize> leftovers, XSSFWorkbook workbook) {

        if (isNull(workbook)) {
            workbook = new XSSFWorkbook();
        }

        XSSFSheet sheet = workbook.createSheet("Залишки на складі");

        sheet.setDefaultColumnWidth(15);
        sheet.setColumnWidth(0, 2200);
        sheet.setColumnWidth(1, 6600);
        sheet.setColumnWidth(2, 6600);
        sheet.setColumnWidth(3, 2200);
        sheet.setColumnWidth(4, 2200);
        sheet.setColumnWidth(5, 2400);

        XSSFFont fontDefault = workbook.createFont();
        fontDefault.setFontName(FONT_NAME);
        fontDefault.setFontHeightInPoints((short) 10);
        fontDefault.setColor(IndexedColors.BLACK.getIndex());
        fontDefault.setBold(false);

        XSSFFont fontBold = workbook.createFont();
        fontBold.setFontName(FONT_NAME);
        fontBold.setFontHeightInPoints((short) 10);
        fontBold.setColor(IndexedColors.BLACK.getIndex());
        fontBold.setBold(true);

        XSSFFont fontHeader = workbook.createFont();
        fontHeader.setFontName(FONT_NAME);
        fontHeader.setFontHeightInPoints((short) 12);
        fontHeader.setColor(IndexedColors.BLACK.getIndex());
        fontHeader.setBold(true);

        XSSFFont fontTitle = workbook.createFont();
        fontTitle.setFontName(FONT_NAME);
        fontTitle.setFontHeightInPoints(TITLE_FONT_SIZE);
        fontTitle.setColor(IndexedColors.BLACK.getIndex());
        fontTitle.setBold(true);

        int rowNum = 0;

//        sheet.addMergedRegion(new CellRangeAddress(3,3,0,6));
//        sheet.addMergedRegion(new CellRangeAddress(6,6,0,6));

        //  HEADER AND FOOTER

        sheet.getHeader().setRight("Залишки на складі станом на " + now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
        sheet.getFooter().setRight("Сторінка &P з &N");

        // ITEMS TABLE HEADER

        CellStyle tableHeaderStyle = workbook.createCellStyle();
        tableHeaderStyle.setFont(fontBold);
        tableHeaderStyle.setBorderBottom(BorderStyle.THIN);
        tableHeaderStyle.setBorderTop(BorderStyle.THIN);
        tableHeaderStyle.setBorderRight(BorderStyle.THIN);
        tableHeaderStyle.setBorderLeft(BorderStyle.THIN);
        tableHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        tableHeaderStyle.setAlignment(HorizontalAlignment.CENTER);

        Row row = sheet.createRow(rowNum++);
        row.setHeight((short) (row.getHeight() * 2));

        Cell cell = row.createCell(0);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Артикул");

        cell = row.createCell(1);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Назва");

        cell = row.createCell(2);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Вид");

        cell = row.createCell(3);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Розмір");

        cell = row.createCell(4);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Ціна");

        cell = row.createCell(5);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Залишок");

        // ITEMS TABLE

        fillLeftoverItems(workbook, sheet, fontDefault, fontBold, rowNum, leftovers);

        // TOTAL PRICE TITLE

        return workbook;
    }

    private void fillLeftoverItems(XSSFWorkbook workbook, XSSFSheet sheet, XSSFFont font, XSSFFont fontBold, Integer rowNum, List<FlowerSize> leftovers) {

        XSSFCellStyle tableCellStyle = workbook.createCellStyle();
        tableCellStyle.setFont(font);
        tableCellStyle.setBorderBottom(BorderStyle.THIN);
        tableCellStyle.setBorderTop(BorderStyle.THIN);
        tableCellStyle.setBorderRight(BorderStyle.THIN);
        tableCellStyle.setBorderLeft(BorderStyle.THIN);
        tableCellStyle.setWrapText(true);
        tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        tableCellStyle.setAlignment(HorizontalAlignment.RIGHT);
        tableCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        tableCellStyle.setFillForegroundColor(IndexedColors.WHITE.getIndex());

        for (int i = 0; i < leftovers.size(); i++) {
            FlowerSize flowerSize = leftovers.get(i);
            Flower flower = flowerSize.getFlower();
            FlowerType flowerType = flower.getFlowerType();
            Group group = flower.getGroup();

            Row row = sheet.createRow(rowNum++);

            Cell cell = row.createCell(0);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getCode());

            cell = row.createCell(1);
            cell.setCellStyle(tableCellStyle);
            String name = flower.getNameOriginal();
            if (isNull(name)) {
                name = flower.getName();
            }
            cell.setCellValue(name);

            cell = row.createCell(2);
            cell.setCellStyle(tableCellStyle);

            String groupNamePart = "";
            if (group != null) {
                groupNamePart = ", " + group.getNameSingle();
            }
            XSSFRichTextString fullName = new XSSFRichTextString();
            fullName.append(flowerType.getNameSingle() + groupNamePart, font);
//            fullName.append(flowerType.getNameSingle(), font);
            cell.setCellValue(fullName);

            cell = row.createCell(3);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getSize().getName());

            cell = row.createCell(4);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getPrice() / 100 + " грн");

            cell = row.createCell(5);
            cell.setCellStyle(tableCellStyle);
            cell.setCellValue(flowerSize.getAvailable() + " шт");

        }

    }


    @Transactional
    public Workbook exportOrdersToExcel(List<Order> orders) {

        XSSFWorkbook workbook = new XSSFWorkbook();

        for (int i = 0; i < orders.size(); i++) {
            Order order = orders.get(i);
            exportOrderToExcel(order, workbook);
        }

        return workbook;
    }

    @Transactional
    public Workbook prepareProcessingBlank(List<Order> orders) {

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Бланк обробки замовлень");

        sheet.setColumnWidth(0, 4800);
        sheet.setColumnWidth(1, 4400);
        sheet.setColumnWidth(2, 4400);
        sheet.setColumnWidth(3, 4400);
        sheet.setColumnWidth(4, 4400);

        XSSFFont fontDefault = workbook.createFont();
        fontDefault.setFontName(FONT_NAME);
        fontDefault.setFontHeightInPoints(FONT_SIZE);
        fontDefault.setColor(IndexedColors.BLACK.getIndex());
        fontDefault.setBold(false);

        XSSFFont fontBold = workbook.createFont();
        fontBold.setFontName(FONT_NAME);
        fontBold.setFontHeightInPoints(FONT_SIZE);
        fontBold.setColor(IndexedColors.BLACK.getIndex());
        fontBold.setBold(true);

        int rowNum = 0;
        Row row;
        Cell cell;

        // HEADERS

        CellStyle tableHeaderStyle = workbook.createCellStyle();
        tableHeaderStyle.setFont(fontBold);
        tableHeaderStyle.setBorderBottom(BorderStyle.THIN);
        tableHeaderStyle.setBorderTop(BorderStyle.THIN);
        tableHeaderStyle.setBorderRight(BorderStyle.THIN);
        tableHeaderStyle.setBorderLeft(BorderStyle.THIN);
        tableHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        tableHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
        tableHeaderStyle.setWrapText(true);

        row = sheet.createRow(rowNum++);
        row.setHeight((short) (row.getHeight() * 2));

        cell = row.createCell(0);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Замовлення №");

        cell = row.createCell(1);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Відправлено");

        cell = row.createCell(2);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Накладна №");

        cell = row.createCell(3);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Накладна відправлена");

        cell = row.createCell(4);
        cell.setCellStyle(tableHeaderStyle);
        cell.setCellValue("Відмічено в магазині");

        for (Order order: orders) {
            row = sheet.createRow(rowNum++);
            cell = row.createCell(0);
            cell.setCellStyle(tableHeaderStyle);
            cell.setCellValue(order.getId());

            cell = row.createCell(1);
            cell.setCellStyle(tableHeaderStyle);

            cell = row.createCell(2);
            cell.setCellStyle(tableHeaderStyle);

            cell = row.createCell(3);
            cell.setCellStyle(tableHeaderStyle);

            cell = row.createCell(4);
            cell.setCellStyle(tableHeaderStyle);
        }

        return workbook;
    }


}
